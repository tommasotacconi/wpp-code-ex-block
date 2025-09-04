class TypewriterWithTags {
    constructor(element, options = {}) {
        this.element = element;
        this.speed = options.speed || 120;
        this.errorSpeed = options.errorSpeed || 300;
        this.backspaceSpeed = options.backspaceSpeed || 20;
        this.errorCount = options.errorCount || 7;
        this.typos = options.typos || ['sr', 'p', 'eb', 'è', '+'];
        
        this.originalHTML = element.innerHTML;
        this.textNodes = [];
        this.currentNodeIndex = 0;
        this.currentCharIndex = 0;
        this.totalChars = 0;
        this.errorPoints = [];
        
        this.init();
    }
    
    init() {
        // Clear the element
        this.element.innerHTML = '';
        
        // Parse the original HTML to extract text nodes and their positions
        this.parseHTML();
        
        // Generate random error points
        this.generateErrorPoints();
        
        // Start typing
        this.type();
    }
    
    parseHTML() {
        // Create a temporary element to parse the HTML
        const temp = document.createElement('div');
        temp.innerHTML = this.originalHTML;
        
				console.log('Original HTML:', this.originalHTML);
				console.log('Temp element:', temp);

        this.textNodes = [];
        this.totalChars = 0;
        
        // Recursively traverse and collect text nodes with their positions
        this.traverseNodes(temp, this.element);

				console.log(`Parsed ${this.textNodes.length} text nodes, total chars: ${this.totalChars}`);
				this.textNodes.forEach((node, i) => {
					console.log(`Node ${i}: "${node.originalText}" (${node.originalText.length} chars)`);
				});
    }
    
    traverseNodes(sourceNode, targetParent) {
        for (let child of sourceNode.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                // It's a text node - include ALL text content, even whitespace-only
                if (child.textContent.length > 0) {
                    const textElement = document.createTextNode('');
                    targetParent.appendChild(textElement);
                    
                    this.textNodes.push({
                        element: textElement,
                        originalText: child.textContent,
                        currentText: '',
                        startPosition: this.totalChars
                    });
                    
                    this.totalChars += child.textContent.length;
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                // It's an element node, recreate it and traverse its children
                const newElement = document.createElement(child.tagName.toLowerCase());
                
                // Copy attributes
                for (let attr of child.attributes) {
                    newElement.setAttribute(attr.name, attr.value);
                }
                
                targetParent.appendChild(newElement);
                this.traverseNodes(child, newElement);
            }
        }
    }
    
    generateErrorPoints() {
        this.errorPoints = [];
        while (this.errorPoints.length < this.errorCount && this.errorPoints.length < this.totalChars) {
            const randomPoint = Math.floor(Math.random() * this.totalChars);
            if (!this.errorPoints.includes(randomPoint)) {
                this.errorPoints.push(randomPoint);
            }
        }
        this.errorPoints.sort((a, b) => a - b);
        console.log('Error points:', this.errorPoints);
    }
    
    getCurrentPosition() {
        let position = 0;
        for (let i = 0; i < this.currentNodeIndex; i++) {
            position += this.textNodes[i].originalText.length;
        }
        return position + this.currentCharIndex;
    }
    
    findNodeAndCharAtPosition(position) {
        let currentPos = 0;
        for (let i = 0; i < this.textNodes.length; i++) {
            const nodeLength = this.textNodes[i].originalText.length;
            if (position <= currentPos + nodeLength) {
                return {
                    nodeIndex: i,
                    charIndex: position - currentPos
                };
            }
            currentPos += nodeLength;
        }
        return null;
    }
    
    addCharToCurrentPosition(char) {
        if (this.currentNodeIndex < this.textNodes.length) {
            const node = this.textNodes[this.currentNodeIndex];
            node.currentText += char;
            // Use textContent to preserve whitespace and line feeds
            node.element.textContent = node.currentText;
        }
    }
    
    removeLastChar() {
				// Find the last non-empty node with text
				for (let i = this.textNodes.length - 1; i >= 0; i--) {
					const node = this.textNodes[i];
					if (node.currentText.length > 0) {
						node.currentText = node.currentText.slice(0, -1);
						node.element.textContent = node.currentText;
						return true;
					}
				}
				return false;
    }
    
    getNextChar() {
				console.log(`getNextChar: nodeIndex=${this.currentNodeIndex}, charIndex=${this.currentCharIndex}, totalNodes=${this.textNodes.length}`);

        if (this.currentNodeIndex < this.textNodes.length) {
            const node = this.textNodes[this.currentNodeIndex];
						console.log(`Current node text length: ${node.originalText.length}`);

            if (this.currentCharIndex < node.originalText.length) {
                const char = node.originalText[this.currentCharIndex];
								console.log(`Returning char: "${char}" (code: ${char.charCodeAt(0)})`);
								return char;
            } else {
                // Move to next node
								console.log(`Moving to next node from ${this.currentNodeIndex} to ${this.currentNodeIndex + 1}`);
                this.currentNodeIndex++;
                this.currentCharIndex = 0;

								if (this.currentNodeIndex >= this.textNodes.length) {
									console.log(`Reached end of nodes`);
									return null;
								}

                return this.getNextChar();
            }
        }
				console.log(`No more characters - end of typing`);
        return null;
    }
    
    async type() {
        const currentPosition = this.getCurrentPosition();
        console.log(`type() called - position: ${currentPosition}, nodeIndex: ${this.currentNodeIdex}, charIndex: ${this.currentCharIndex}`);

				// Safety check to prevent infinite loops
				if (currentPosition > this.totalChars) {
					console.error(`Position ${currentPosition} exceeds total chars ${this.totalChars} - stopping`);
					return;
				}
				
        // Check if we should make an error at this position
        const errorIndex = this.errorPoints.indexOf(currentPosition);
        if (errorIndex !== -1) {
            await this.handleError();
            this.errorPoints.splice(errorIndex, 1);
        }
        
        // Get the next character to type
        const nextChar = this.getNextChar();
				console.log(`Next char: ${nextChar ? `"${nextChar}"` : 'null'}`);

				this.addCharToCurrentPosition(nextChar);
				this.currentCharIndex++;
				console.log(`After typing: nodeIndex=${this.currentNodeIndex}, charIndex=${this.currentCharIndex}`);
        
        if (nextChar !== null) {
            // Debug: log line feeds and special characters
            if (nextChar === '\n') {
                console.log(`Typing line feed at position ${currentPosition}`);
            } else if (nextChar === '\r') {
                console.log(`Typing carriage return at position ${currentPosition}`);
            } else if (nextChar === '\t') {
                console.log(`Typing tab at position ${currentPosition}`);
            }
            
            this.addCharToCurrentPosition(nextChar);
            this.currentCharIndex++;
            
            // Continue typing
            setTimeout(() => this.type(), this.speed);
        } else {
            console.log('Typing completed');
        }
    }
    
    async handleError() {
        // Add a random typo
        const typo = this.typos[Math.floor(Math.random() * this.typos.length)];
        console.log(`Making error at position ${this.getCurrentPosition()}: ${typo}`);
        
        // Type the typo
        for (let char of typo) {
            this.addCharToCurrentPosition(char);
            await new Promise(resolve => setTimeout(resolve, this.speed));
        }
        
        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, this.errorSpeed));
        
        // Delete the typo
        for (let i = 0; i < typo.length; i++) {
            this.removeLastChar();
            await new Promise(resolve => setTimeout(resolve, this.backspaceSpeed));
        }
    }
}

// Multiple initialization methods to ensure it works
function initTypewriter() {
    console.log('Initializing typewriter...');
    
    // Try multiple selectors to find your elements
    const selectors = [
        'code.typewriter',
        '.typewriter-content code',
        '.typewriter-code-block code',
        'code[data-content]',
        '.typewriter'
    ];
    
    let found = false;
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`Found ${elements.length} elements with selector: ${selector}`);
        
        elements.forEach((block, index) => {
            console.log(`Element ${index}:`, block);
            console.log(`Content:`, block.innerHTML);
            
            // Only initialize if it has content and hasn't been initialized
            if (block.innerHTML.trim() && !block.hasAttribute('data-typewriter-initialized')) {
                console.log(`Initializing typewriter on element ${index}`);
                block.setAttribute('data-typewriter-initialized', 'true');
                found = true;
                
                new TypewriterWithTags(block, {
                    speed: 100,
                    errorSpeed: 800,
                    backspaceSpeed: 60,
                    errorCount: 3,
                    typos: ['sr', 'p', 'eb', 'è', '+', 'x', 'q']
                });
            } else if (block.hasAttribute('data-typewriter-initialized')) {
                console.log(`Element ${index} already initialized`);
            } else {
                console.log(`Element ${index} has no content`);
            }
        });
    });
    
    if (!found) {
        console.log('No typewriter elements found, retrying in 500ms...');
        setTimeout(initTypewriter, 500);
    }
}

// Try multiple events to catch when elements are ready
document.addEventListener('DOMContentLoaded', initTypewriter);
window.addEventListener('load', initTypewriter);
