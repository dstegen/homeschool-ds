/*!
 * utils/create-dir.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');


function createDir (filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('* Creating directory: '+filePath);
    fs.mkdirSync(filePath);
  } else {
    console.log('- directory already exists: '+filePath);
  }
}


module.exports = createDir;
