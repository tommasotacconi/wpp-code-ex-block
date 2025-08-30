import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

registerBlockType('plugin-cod-ex-block/code-ex-block', {
	edit() {
		return (
			<pre className="cod-ex-block">
				<code>
					<InnerBlocks />
				</code>
			</pre>
		);
	},
	save() {
		return (
			<pre className="cod-ex-block">
				<code>
					<InnerBlocks.Content />
				</code>
			</pre>
		);
	}
});