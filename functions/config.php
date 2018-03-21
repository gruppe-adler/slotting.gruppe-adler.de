<?php

function register_mainmenu()
{
    /*================================
     *  register and return mainmenu;
     */
    $menu_items = wp_get_nav_menu_items('primary');
    $menu = array();
    foreach ($menu_items as $menu_item) {
        $menutype = $menu_item->type_label;

        if ($menutype === "Post" || $menutype === "Page") {
            $item_slug = get_post($menu_item->object_id)->post_name;
        } else if ($menutype == "Category") {
            $item_slug = get_category($menu_item->object_id)->slug;
        }
        /*
         *  create instance of menu-item class and push it to $menu array
         */
        $item = array(
            'title' => $menu_item->title,
            'slug' => $item_slug,
            'type' => $menutype,
            'url' => $menu_item->url
        );
        array_push($menu, $item);
    }
    return $menu;
}

 function getCategories(){
     $categories = array();
     $cats = get_categories();
     foreach ($cats as $cat){
         array_push($categories, $cat);
     }
     return $categories;
 }

function register_Config()
{
    /*
    * add our configuration to the main script.
    */
    $config = array(
        'template_directory' => get_template_directory(),
        'site_url' => get_option('siteurl'),
        'site_title' => get_option('blogname'),
        'site_description' => get_option('blogdescription'),
        'home_id' => get_option('page_on_front'),
        'blog_id' => get_option('page_for_posts'),
        'admin_email' => get_option('admin_email'),
        'menu' => register_mainmenu(),
        'categories' => getCategories()
    );
    wp_localize_script('main', 'app_config', $config);
}
?>