/*!
 * lib/getFilesList.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const path = require('path');
const fs = require('fs');


function getFilesList (filePath) {
  let filesList = [];
  let readPath = path.join(__dirname, '../data/classes/', filePath);
  if (fs.existsSync(readPath)) {
    try {
      //console.log('+ Reading fileList from: '+readPath);
      filesList = fs.readdirSync(readPath);
    } catch (e) {
      console.log('- ERROR reading directory: '+e);
    }
  }
  return filesList;
}


module.exports = getFilesList;
