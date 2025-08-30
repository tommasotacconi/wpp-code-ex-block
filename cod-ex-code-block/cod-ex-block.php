<?php

/**
 * Plugin Name: Coding example code block
 * Description: A custom code block with consistent styling but
 * editable content per page.
 * Version: 1.0
 * Author: Tommaso Tacconi
 */

function cod_ex_block_register()
{
	// Register the block from build/index.js
	register_block_type(__DIR__ . '/build');
}
add_action('init', 'cod_ex_block_register');