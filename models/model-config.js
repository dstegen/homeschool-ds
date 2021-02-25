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
    if (fields[key] && fields[key] !== '' && key !== 'classes') {
      myConfig[key] = fields[key];
    }
  });
  saveFile(path.join(__dirname, '../data/school'), 'config.json', myConfig);
  console.log('+ Updated schools config sucessfully!');
}

function addNewGroup (fields) {
  if (fields.newGroup !== '') {
    try {
      myConfig.classes.push(fields.newGroup);
      saveFile(path.join(__dirname, '../data/school'), 'config.json', myConfig)
      createDir(path.join(__dirname, '../data/classes', fields.newGroup));
      saveFile(path.join(__dirname, '../data/classes', fields.newGroup), 'chat.json', []);
      saveFile(path.join(__dirname, '../data/classes', fields.newGroup), 'config.json', { courses: [] });
      saveFile(path.join(__dirname, '../data/classes', fields.newGroup), 'lessons.json', { lessons: [] });
      console.log('+ Added new class/group: '+fields.newGroup);
    } catch (e) {
      console.log('- ERROR couldn\'t add class/group:'+e );
    }
  }
}

function getGroupConfig (group='') {
  if (group && group !== '') {
    return loadFile(path.join(__dirname, '../data/classes', group, 'config.json'));
  } else {
    return {};
  }
}

function updateGroupConfig (fields) {
  //console.log(fields);
  if (fields.group !== '') {
    let groupConfig = getGroupConfig(fields.group);
    if (fields.newCourse && fields.newCourse !== '') {
      // Add new course
      let tmpObj = {};
      tmpObj.name = fields.newCourse;
      tmpObj.color = fields.color;
      tmpObj.lpw = 2;
      groupConfig.courses.push(tmpObj);
    } else {
      // Update course settings
      Object.keys(fields).forEach( key => {
        if (key !== 'action' && key !== 'group') {
          groupConfig.courses.filter( item => item.name === key)[0].color = fields[key];
        }
      });
    }
    //console.log(groupConfig);
    saveFile(path.join(__dirname, '../data/classes', fields.group), 'config.json', groupConfig);
    console.log('+ Course config for class/group '+fields.group+' sucessfully updated!');
  }
}


module.exports = { getConfig, updateSettings, addNewGroup, getGroupConfig, updateGroupConfig };
