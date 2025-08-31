import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';

registerBlockType('plugin-cod-ex-block/cod-ex-block', {
	edit({ attributes, setAttributes }) {
		const { content } = attributes;
		const blockProps = useBlockProps();
		
		return (
			<div {...blockProps}>
				<pre className="cod-ex-block">
					<RichText
						tagName="code"
						value={content}
						onChange={(content) => setAttributes({ content })}
						placeholder="Enter your code here..."
						preserveWhiteSpace
						__unstableDisableFormats
						/>
				</pre>
			</div>
		);
	},
	save({ attributes }) {
		const { content } = attributes;
		const blockProps = useBlockProps.save();

		return (
			<div {...blockProps}>
				<pre className="cod-ex-block">
					<code>{content}</code>
				</pre>
			</div>
		);
	}
});