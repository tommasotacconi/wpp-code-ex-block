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
	if ($block['blockName'] !== 'cod-ex/code')
		return $block_content;

	$meta_value = get_post_meta(get_the_ID(), 'codex_content', true);

	if (!empty($meta_value))
		// Add language class for syntax highlighting
		$block_content = str_replace('<code></code>', '<code class="language-javascript typewriter">' . esc_html($meta_value) . '</code>', $block_content);

	return $block_content;
}, 10, 2);

function cod_ex_register()
{
	// Register the block from build/index.js
	register_block_type(__DIR__ . '/build');
}
add_action('init', 'cod_ex_register');

// Enqueue scripts for syntex highlighting (Prism.js)
add_action('wp_enqueue_scripts', function () {
	// Enqueue Prism CSS and JS
	wp_enqueue_style('prismjs-css', plugin_dir_url(__FILE__) . 'github-dark-prism.css');
	wp_enqueue_script('prismjs-js', 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js', array(), null, true);

	// Add language components you need
	wp_enqueue_script('prismjs-autoloader', 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js', array('prismjs-js'), null, true);
});

// Enqueue scripts for typewriter effect with real typing errors simulation
add_action('wp_enqueue_scripts', function () {
	wp_enqueue_scripts('typewriter-effect', plugin_dir_url(__FILE__) . 'src/typewriter.js', array(), '1.0.0', true);
});
