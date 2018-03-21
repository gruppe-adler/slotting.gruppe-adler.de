<?php
/** Here are functions to handle robots requests and return static HTML contains only the meta tags.
  *  Routes must match the route scheme of the angular app
  */

  /** TODO: WP should return only the <head> with the meta tags and should NOT execute the rest of function.php */

/** Detects if a bot */
function bot_detected() {

  if (isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/bot|crawl|slurp|spider/i', $_SERVER['HTTP_USER_AGENT'])) {
    return TRUE;
  }
  else {
    return FALSE;
  }
}

/** Inject meta tags for single */
function single_meta_tags($id){

  $title = get_post_field('post_title', $id);
  $desc = get_post_field('post_excerpt', $id);
  $cats = get_the_category( $id );
  $keywords = '';
  foreach ( $cats as $cat ) {
      $keywords .= $cat->cat_name . ", ";
  }

   echo '<title>' . $title . '</title>';
   echo '<meta name="keywords" content="' . $keywords . '" />' . "\n";
   echo '<meta name="description" content="' . $desc . '" />' . "\n";
   echo '<meta name="og:title" content="' . $title . '" />' . "\n";
   echo '<meta name="og:description" content="' . $desc . '" />' . "\n";
}

/** Router */
function robotsRoutes(){
  $uri_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $uri_segments = explode('/', $uri_path);
  $route = $_SERVER["REQUEST_URI"];
  if($uri_segments[2]=="meta"){  
    if($uri_segments[3]){
      single_meta_tags($uri_segments[3]);
    }
    else{
      /** TODO: Get meta tags for requested page */
    }
  }
}

add_action('wp_head','robotsRoutes');

?>