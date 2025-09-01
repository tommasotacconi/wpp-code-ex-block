<?php

/**
 * Plugin Name: Coding example code block
 * Description: A custom code block with consistent styling but editable content per page.
 * Version: 1.0
 * Author: Tommaso Tacconi
 */

// Prevent direct access
if (!defined('ABSPATH')) {
	exit;
}

// Register the meta field
add_action('init', function () {
	register_post_meta('page', 'codex_content', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'string'
	));
});

// Render the meta content on frontend
add_filter('render_block', function ($block_content, $block) {
	if ($block['blockName'] !== 'plugin-cod-ex-block/cod-ex-block')
		return $block_content;

	$meta_value = get_post_meta(get_the_ID(), 'codex_content', true);

	if (!empty($meta_value)) 
		$block_content = str_replace('<code></code>', '<code>' . esc_html($meta_value) . '</code>', $block_content);

	return $block_content;
}, 10, 2)

function cod_ex_block_register()
{
	// Register the block from build/index.js
	register_block_type(__DIR__ . '/build');
}
add_action('init', 'cod_ex_block_register');