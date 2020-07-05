/*!
 * views/templates/header.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';


function header () {
  return `
    <!DOCTYPE HTML>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <!-- Bootstrap, jquery and trumbowyg CSS -->
            <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
            <!--
            <link rel="stylesheet" href="/node_modules/jquery-ui-dist/jquery-ui.min.css">
            <link rel="stylesheet" href="/public/trumbowyg.css">
            -->
          <!-- New Orange Default Theme for Backend -->
            <link rel="stylesheet" href="/public/styles.css">
          <!-- Favicon -->
          <title>HomeSchool-DS</title>
        </head>
        <body>
          <div id="homeschool-ds">`;
}


module.exports = header;
