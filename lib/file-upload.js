/*!
 * lib/file-upload.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required Moduls
const fs = require('fs');
const path = require('path');


function fileUpload (fields, files, filePath, fileId='filetoupload') {
  console.log('+ Upload file: '+files[fileId].name);
  let oldpath = files[fileId].path;
  if (!fs.existsSync(path.join(__dirname, '../data/classes', fields.group, filePath))) {
    fs.mkdirSync(path.join(__dirname, '../data/classes', fields.group, filePath), { recursive: true });
  }
  let newpath = path.join(__dirname, '../data/classes', fields.group, filePath, files[fileId].name);
  try {
    fs.renameSync(oldpath, newpath);
    fs.chmodSync(newpath, '0640');
    console.log('+ Saved successfully file: '+newpath);
    return true;
  } catch (e) {
    console.log('- ERROR file upload, saving+changing file: ' + e);
    return false;
  }
}


module.exports = fileUpload;
