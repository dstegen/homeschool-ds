/*!
 * models/model-config.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');
const createDir = require('../utils/create-dir');


let myConfig = loadFile(path.join(__dirname, '../data/school/config.json'), true);

function getConfig () {
  return myConfig;
}

function updateSettings (fields) {
  Object.keys(myConfig).forEach( key => {
    if (fields[key] && fields[key] !== '') {
      if (key === 'classes') {
        myConfig[key] = fields[key].split(',');
      } else {
        myConfig[key] = fields[key];
      }
    }
  });
  //console.log(myConfig);
  saveFile(path.join(__dirname, '../data/school'), 'config.json', myConfig);
  console.log('+ Updated schools config sucessfully!');
}

function addNewGroup (fields) {
  if (fields.newGroup !== '') {
    try {
      myConfig.classes.push(fields.newGroup);
      createDir(path.join('data/classes', fields.newGroup));
      saveFile(path.join(__dirname, '../data/classes', fields.newGroup), 'chat.json', []);
      saveFile(path.join(__dirname, '../data/classes', fields.newGroup), 'config.json', { courses: [] });
      saveFile(path.join(__dirname, '../data/classes', fields.newGroup), 'lessons.json', { lessons: [] });
      console.log('+ Added new class/group: '+fields.newGroup);
    } catch (e) {
      console.log('- ERROR couldn\'t add class/group:'+e );
    }
  }
}

module.exports = { getConfig, updateSettings, addNewGroup };
