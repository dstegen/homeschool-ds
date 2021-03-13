/*!
 * models/model-chat.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid').v4;
const { getLessons } = require('./model-lessons');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');
const fileUpload = require('../lib/file-upload');


function createOnlinelesson (data, group, user) {
  let newUuid = uuidv4();
  let options = [];
  let docs = [];
  let chalkboardBg = '/public/blackboard.jpg';
  ['jitsi', 'chalkboard', 'docs', 'youtube', 'classchat'].forEach( item => {
    if (data.fields[item] === 'true') {
      options.push(item);
    }
  });
  if (data.files.filetoupload !== undefined && data.files.filetoupload.name) {
    if (fileUpload(data.fields, data.files, 'onlinelesson')) {
        docs.push(path.join('/data/classes', group, 'onlinelesson', data.files.filetoupload.name));
    }
  }
  if (data.files.chalkboardBg !== undefined && data.files.chalkboardBg.name) {
    if (fileUpload(data.fields, data.files, 'onlinelesson', 'chalkboardBg')) {
        chalkboardBg = path.join('/data/classes', group, 'onlinelesson', data.files.chalkboardBg.name);
    }
  }
  let recentLesson = {
    key: newUuid,
    id: newUuid,
    lesson: data.fields.lessonName,
    group: group,
    docs: docs,
    chalkboardBg: chalkboardBg,
    youtube: data.fields.youtubeId !== '' ? data.fields.youtubeId.replace(/\s/g, '').split(',') : [], // Test-YT-IDs: 'ksCrRr6NBg0','Wbfp4_HQQPM'
    links: [],
    teacher: user,
    students: [],
    options: options,
    timeStamp: new Date()
  };
  if (data.fields.lessonName === '' && data.fields.lessonId !== '' && typeof(Number(data.fields.lessonId)) === 'number') {
    let myLesson = getLessons(group).filter( item => item.id === Number(data.fields.lessonId))[0];
    recentLesson.lesson = myLesson.lesson + ' - ' + myLesson.chapter;
    recentLesson.id = myLesson.id;
    if (myLesson.files && myLesson.files.length > 0) recentLesson.docs = myLesson.files;
    if (myLesson.videos && myLesson.videos.length > 0) recentLesson.youtube = myLesson.videos;
    if (myLesson.links && myLesson.links.length > 0) recentLesson.links = myLesson.links;
  }
  saveFile(path.join(__dirname, '../data/classes', group.toString()), 'onlinelesson.json', recentLesson);
  return recentLesson;
}

function getRecentLesson (group) {
  if (fs.existsSync(path.join(__dirname, '../data/classes', group, 'onlinelesson.json'))) {
    try {
      return loadFile(path.join(__dirname, '../data/classes', group, 'onlinelesson.json'));
    } catch (e) {
      console.log('- ERROR loading recentLesson: '+e);
    }
  } else {
    return {};
  }
}

function disposeOnlinelesson (recentLesson) {
  try {
    fs.unlinkSync(path.join(__dirname, '../data/classes', recentLesson.group, 'onlinelesson.json'));
    if (fs.existsSync(path.join(__dirname, '../data/classes', recentLesson.group, 'onlinelesson.png'))) {
      fs.unlinkSync(path.join(__dirname, '../data/classes', recentLesson.group, 'onlinelesson.png'));
    }
    if (recentLesson.docs[0] && recentLesson.docs[0].includes('onlinelesson') && fs.existsSync(path.join(__dirname, '../', recentLesson.chalkboardBg))) {
      fs.unlinkSync(path.join(__dirname, '../', recentLesson.chalkboardBg));
    }
    if (recentLesson.docs[0] && recentLesson.docs[0].includes('onlinelesson') && fs.existsSync(path.join(__dirname, '../', recentLesson.docs[0]))) {
      fs.unlinkSync(path.join(__dirname, '../', recentLesson.docs[0]));
    }
  } catch (e) {
    console.log('- ERROR disposing Onlinelesson: '+e);
  }
}

function joinOnlinelesson (recentLesson, user) {
  if (recentLesson.students === undefined) recentLesson.students = [];
  if (recentLesson.students.filter( item => item.id === user.id).length === 0 && recentLesson.group === user.group) {
    recentLesson.students.push(user);
    saveFile(path.join(__dirname, '../data/classes', user.group), 'onlinelesson.json', recentLesson);
    return true;
  } else {
    return false;
  }
}

function exitOnlinelesson (recentLesson, user) {
  recentLesson.students = recentLesson.students.filter( item => item.id !== user.id);
  saveFile(path.join(__dirname, '../data/classes', user.group), 'onlinelesson.json', recentLesson);
}


module.exports = { createOnlinelesson, getRecentLesson, disposeOnlinelesson, joinOnlinelesson, exitOnlinelesson };
