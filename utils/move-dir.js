/*!
 * utils/move-dir.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');


function moveDir (oldDir, newDir) {
  if (fs.existsSync(oldDir) && !fs.existsSync(newDir))
  try {
    fs.renameSync(oldDir, newDir);
  } catch (e) {
    console.log('- ERROR moving directory: '+e);
  }
}


module.exports = moveDir;
