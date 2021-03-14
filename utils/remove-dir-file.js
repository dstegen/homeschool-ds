/*!
 * utils/remove-dir-file.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');


function removeDirFile (path) {
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) {
      try {
        fs.rmdirSync(path, { recursive: true })
      } catch (e) {
        if (e.code === 'ENOTEMPTY') {
          // TODO: implement recursiv deletion here...
          console.log('- ERROR directories are not empty: '+e);
        } else {
          console.log('- ERROR removing directory: '+e);
        }
      }
    } else {
      try {
        fs.unlinkSync(path);
      } catch (e) {
        console.log('- ERROR removing file: '+e);
      }
    }
  } else {
    console.log('- ERROR file/directory doesn\'t exists!');
  }
}


module.exports = removeDirFile;
