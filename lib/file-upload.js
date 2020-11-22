/*!
 * lib/file-upload.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Moduls
const fs = require('fs');
const path = require('path');
const { updateLesson } = require('../models/model-lessons');


function fileUpload (fields, files, filePath) {
  let history = {};
  console.log('+ Upload file: '+files.filetoupload.name);
  let oldpath = files.filetoupload.path;
  if (!fs.existsSync(path.join(__dirname, '../data/classes', fields.group, filePath))) {
    fs.mkdirSync(path.join(__dirname, '../data/classes', fields.group, filePath), { recursive: true });
  }
  let newpath = path.join(__dirname, '../data/classes', fields.group, filePath, files.filetoupload.name);
  history.id = files.filetoupload.name;
  try {
    fs.renameSync(oldpath, newpath);
    fs.chmodSync(newpath, '0640');
    let addFields = {
      group: fields.group,
      id: fields.courseId,
      files: path.join('/data/classes', fields.group, filePath, files.filetoupload.name),
    }
    updateLesson(addFields);
    console.log('+ Saved successfully file: '+newpath);
    history.msg = 'Upload successful!';
  } catch (e) {
    history.msg = '- ERROR file upload, saving+changing file: ' + e;
    console.log(history.msg);
  }
  return history;
}


module.exports = fileUpload;
