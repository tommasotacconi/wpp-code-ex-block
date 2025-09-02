import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';

registerBlockType('cod-ex/code', {
	edit({ attributes, setAttributes }) {
		const { codex_content } = attributes;
		const blockProps = useBlockProps();
		
		return (
			<div {...blockProps}>
				<pre className="cod-ex-block">
					<RichText
						tagName="code"
						value={codex_content}
						onChange={(codex_content) => setAttributes({ codex_content })}
						placeholder="Enter your code here..."
						preserveWhiteSpace
						__unstableDisableFormats
						/>
				</pre>
			</div>
		);
	},
	save({ attributes }) {
		const { codex_content } = attributes;
		const blockProps = useBlockProps.save();

		return (
			<div {...blockProps}>
				<pre className="cod-ex-block">
					<code>{codex_content}</code>
				</pre>
			</div>
		);
	}
});