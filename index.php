<?php
  global $wp_query;

  if (array_key_exists('assets', $wp_query->query_vars)) {
    header('Location: ' . $wp_query->query_vars['assets']);
    exit();
  }

  /*
  if (array_key_exists('js', $wp_query->query_vars)) {
      header('Location: wp-content/themes/gruppe-adler/dist/ngsw-worker.js');//  . $wp_query->query_vars['js']);
      exit();
  }*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
  <head>
      <meta charset="<?php bloginfo('charset'); ?>"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title><?php wp_title(); ?></title>
      <link rel="profile" href="http://gmpg.org/xfn/11"/>
      <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>"/>

      <link href="//fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link href="//fonts.googleapis.com/css?family=Oswald|Source+Sans+Pro" rel="stylesheet">
      <link href="//www.gruppe-adler.de/wp-content/plugins/dk-pricr-responsive-pricing-table/inc/css/rpt_style.min.css" rel="stylesheet">

      <script defer src="https://use.fontawesome.com/releases/v5.0.4/js/all.js"></script>
      <base href="/wordpress/">
      <?php wp_head(); ?>
  </head>
  <body>
    <!--googleoff: index-->
      <!-- Google Analytics -->
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      </script>
      <!-- End Google Analytics -->

      <!-- No JS display -->
      <div id="noJS" style="margin: 5vh 5vw; height: 90vh; width: 90vw; display: flex; justify-content: center; align-items: center;" *ngIf="false">
        <script>
          document.getElementById('noJS').remove();
        </script>
        <div style="display: inline-block; margin-right: 5rem;">
          <img src="https://www.gruppe-adler.de/wp-content/uploads/adlerlogo_240.png">
        </div>
        <div style="display: inline-block; text-align: center;">
          <h1 style="font-family: Oswald, sans-serif">Gerne würden wir Dir hier was anzeigen</h1>
          <p style="font-family: 'Source Sans Pro', sans-serif; font-size: 15pt;">
            Aber es scheint so, als ob Du JavaScript nicht aktiviert hast.<br/>
            Wenn Du fertig bist, lade diese Seite einfach neu.
          </p>
        </div>
      </div>
    <!--googleon: index-->

    <app-root></app-root>
    <?php wp_footer(); ?>
  </body>
</html>
