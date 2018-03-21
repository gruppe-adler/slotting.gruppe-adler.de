<?php

require_once('functions/robots.php');
require_once('functions/config.php');

function wpb_adding_scripts() {
    wp_deregister_script('jquery');
    wp_deregister_script('wp-api');

    wp_register_script('inline', get_template_directory_uri() . '/dist/inline.bundle.js', array(), false, true);
    wp_register_script('polyfills', get_template_directory_uri() . '/dist/polyfills.bundle.js', array(), false, true);
    wp_register_script('main', get_template_directory_uri() . '/dist/main.bundle.js', array(), false, true);
    wp_register_script('ngsw-worker', get_template_directory_uri() . '/dist/ngsw-worker.js', array(), false, true);

    wp_enqueue_script('inline');
    wp_enqueue_script('polyfills');
    wp_enqueue_script('main');
    wp_enqueue_script('ngsw-worker');
}
add_action('wp_enqueue_scripts', 'wpb_adding_scripts');

function wpb_adding_styles() {
    wp_enqueue_style('style', get_template_directory_uri(). '/dist/styles.bundle.css');
}
add_action('wp_enqueue_scripts', 'wpb_adding_styles');

function assets_tag_init() {
  add_rewrite_tag('%assets%', '([^&]+)');
  add_rewrite_tag('%js%', '([^&]+)');
}
add_action('init', 'assets_tag_init', 10, 0);

function assets_rewrite_init($rules) {
    $assetsRule = array(
      'assets/(.+)/?$' => ('index.php?assets=' . get_template_directory_uri() . '/dist/assets/$matches[1]'),
      '([^/]+).js/?$' => ('index.php?js=' . get_template_directory_uri() . '/dist/$matches[1].js'),
    );
    return array_merge($assetsRule, $rules);
}
add_filter('page_rewrite_rules', 'assets_rewrite_init');

register_activation_hook( __FILE__, 'grad_theme_activation' );
function grad_theme_activation()
{
    // Add the rule first
    assets_rewrite_init();
    // Then flush rewrite rules
    flush_rewrite_rules();
}


// Rewrite DEBUG
/*
ini_set( 'error_reporting', -1 );
ini_set( 'display_errors', 'On' );

echo '<pre>';

add_action( 'parse_request', 'debug_404_rewrite_dump' );
function debug_404_rewrite_dump( &$wp ) {
    global $wp_rewrite;

    echo '<h2>rewrite rules</h2>';
    echo var_export( $wp_rewrite->wp_rewrite_rules(), true );

    echo '<h2>permalink structure</h2>';
    echo var_export( $wp_rewrite->permalink_structure, true );

    echo '<h2>page permastruct</h2>';
    echo var_export( $wp_rewrite->get_page_permastruct(), true );

    echo '<h2>matched rule and query</h2>';
    echo var_export( $wp->matched_rule, true );

    echo '<h2>matched query</h2>';
    echo var_export( $wp->matched_query, true );

    echo '<h2>request</h2>';
    echo var_export( $wp->request, true );

    global $wp_the_query;
    echo '<h2>the query</h2>';
    echo var_export( $wp_the_query, true );
}
add_action( 'template_redirect', 'debug_404_template_redirect', 99999 );
function debug_404_template_redirect() {
    global $wp_filter;
    echo '<h2>template redirect filters</h2>';
    echo var_export( $wp_filter[current_filter()], true );
}
add_filter ( 'template_include', 'debug_404_template_dump' );
function debug_404_template_dump( $template )
{
    echo '<h2>template file selected</h2>';
    echo var_export($template, true);

    echo '</pre>';
    exit();
}
*/
// End DEBUG
?>
