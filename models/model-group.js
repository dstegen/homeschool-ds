/*!
 * models/model-group.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const config = require('./model-config').getConfig();
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');
const createDir = require('../utils/create-dir');
const moveDir = require('../utils/move-dir');
const removeDirFile = require('../utils/remove-dir-file');


function addNewGroup (fields) {
  if (fields.newGroup !== '') {
    try {
      config.classes.push(fields.newGroup);
      saveFile(path.join(__dirname, '../data/school'), 'config.json', config);
      createDir(path.join(__dirname, '../data/classes', fields.newGroup));
      saveFile(path.join(__dirname, '../data/classes', fields.newGroup), 'chat.json', []);
      saveFile(path.join(__dirname, '../data/classes', fields.newGroup), 'config.json', { courses: [] });
      saveFile(path.join(__dirname, '../data/classes', fields.newGroup), 'lessons.json', { lessons: [] });
      console.log('+ Added new class/group: '+fields.newGroup);
    } catch (e) {
      console.log('- ERROR couldn\'t add new group:'+e );
    }
  }
}

function advanceGroup (fields) {
  console.log(fields);
  if (fields.newGroup !== '' && config.classes.includes(fields.oldGroup)) {
    try {
      config.classes = config.classes.filter( item => item !== fields.oldGroup);
      config.classes.push(fields.newGroup);
      saveFile(path.join(__dirname, '../data/school'), 'config.json', config);
      moveDir(path.join(__dirname, '../data/classes', fields.oldGroup), path.join(__dirname, '../data/classes', fields.newGroup));
      if (fields.options.includes('delLessons')) {
        removeDirFile(path.join(__dirname, '../data/classes', fields.newGroup, 'courses'));
        saveFile(path.join(__dirname, '../data/classes', fields.newGroup), 'lessons.json', { lessons: [] });
        removeDirFile(path.join(__dirname, '../data/classes', fields.newGroup, 'onlinelessonscalendar.json'));
      }
      if (fields.options.includes('cleanBoard')) {
        removeDirFile(path.join(__dirname, '../data/classes', fields.newGroup, 'board'));
        removeDirFile(path.join(__dirname, '../data/classes', fields.newGroup, 'board.json'));
      }
      console.log('+ Advanced group '+fields.oldGroup+' to new group '+fields.newGroup);
    } catch (e) {
      console.log('- ERROR couldn\'t advance group:'+e );
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
    saveFile(path.join(__dirname, '../data/classes', fields.group), 'config.json', groupConfig);
    console.log('+ Course config for class/group '+fields.group+' sucessfully updated!');
  }
}


module.exports = { addNewGroup, advanceGroup, getGroupConfig, updateGroupConfig };
