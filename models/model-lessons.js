/*!
 * models/model-lessons.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const path = require('path');
const fs = require('fs');
const { isActualWeek, notValid } = require('../lib/dateJuggler');

function getLessons(myGroup) {
  return loadFile(myGroup);
}

function updateLesson(fields) {
  console.log(fields);
  let myGroup = fields.group;
  let myLessons = getLessons(myGroup);
  if (fields.id && fields.id != '') {
    // update
    Object.keys(fields).forEach( key => {
      if (key !== 'id' && key !== 'group') {
        if (key === 'weekdays') {
          if (fields.weekdays.length < 2) fields.weekdays = [fields.weekdays];
          myLessons.filter(item => item.id == fields.id)[0][key] = fields[key].map( item => { return Number(item) } );
        } else {
          myLessons.filter(item => item.id == fields.id)[0][key] = fields[key];
        }
      }
    });
    saveFile(myLessons, fields.group);
    return myLessons;
  } else {
    // add
    let newItem = {};
    newItem.id = getNewId(myLessons);
    newItem.lessonFinished = [];
    Object.keys(fields).forEach( key => {
      if (key !== 'id' && key !== 'group') {
        if (key === 'weekdays') {
          if (fields.weekdays.length < 2) fields.weekdays = [fields.weekdays];
          newItem[key] = fields[key].map( item => { return Number(item) } );
        } else {
          newItem[key] = fields[key];
        }
      }
    });
    myLessons.push(newItem);
    saveFile(myLessons, fields.group);
    return myLessons;
  }
}

function deleteLesson (fields) {
  let myLessons = getLessons(fields.group);
  console.log(fields);
  myLessons = myLessons.filter( item => item.id != fields.id);
  saveFile(myLessons, fields.group);
  return myLessons;
}

function finishLesson (fields) {
  //console.log(fields);
  let myLessons = getLessons(fields.group);
  let tmpList = myLessons.filter( item => item.id === Number(fields.courseId))[0].lessonFinished;
  tmpList.push(Number(fields.studentId));
  myLessons.filter( item => item.id === Number(fields.courseId))[0].lessonFinished = tmpList;
  //myLessons.filter( item => item.id === fields.courseId)[0].lessonFinished.push(fields.studentId);
  saveFile(myLessons, fields.group);
  return myLessons;
}

function lessonsToday (myGroup, curWeekDay, curWeek) {
  return getLessons(myGroup).filter( lesson => (lesson.weekdays.includes(curWeekDay) && isActualWeek(lesson.validFrom, lesson.validUntil, curWeek)));
}

function lessonsNotFinished (user, inDay) {
  return getLessons(user.group).filter( lesson => (!lesson.lessonFinished.includes(user.id) && notValid(lesson.validUntil, inDay)));
}


// Additional functions

function loadFile (myGroup) {
  let myLessons = [];
  let filePath = path.join(__dirname, '../data/classes', myGroup, 'lessons.json');
  try {
    myLessons = fs.readFileSync(filePath);
    myLessons = JSON.parse(myLessons).lessons;
  } catch (e) {
    console.log('- ERROR loading file: '+e);
  }
  return myLessons;
}

function saveFile (myLessons, myGroup) {
  let filePath = path.join(__dirname, '../data/classes', myGroup, 'lessons.json');
  try {
    if (!fs.existsSync(path.join(__dirname, '../data/classes', myGroup, 'backup'))) {
      fs.mkdirSync(path.join(__dirname, '../data/classes', myGroup, 'backup'));
    }
    fs.copyFileSync(filePath, path.join(__dirname, '../data/classes', myGroup, 'backup', 'lessons-backup_'+new Date()));
    fs.writeFileSync(filePath, JSON.stringify({ lessons: myLessons}));
  } catch (e) {
    console.log('- ERROR backuping and saving file: '+e);
  }
}

function getNewId (lessons) {
  return Math.max(...lessons.map( item => item.id)) + 1;
}


module.exports = { getLessons, updateLesson, deleteLesson, finishLesson, lessonsToday, lessonsNotFinished };
