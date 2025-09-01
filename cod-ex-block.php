<?php

/**
 * Plugin Name: Coding example code block
 * Description: A custom code block with consistent styling but editable content per page.
 * Version: 1.0
 * Author: Tommaso Tacconi
 */

// Register the meta field
add_action('init', function () {
	register_post_meta('', 'codex_content', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'string'
	));
});

function cod_ex_block_register()
{
	// Register the block from build/index.js
	register_block_type(__DIR__ . '/build');
}
add_action('init', 'cod_ex_block_register');
