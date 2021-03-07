/*!
 * models/model-lessons.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const path = require('path');
const { isActualWeek, notValid, getWebDate } = require('../lib/dateJuggler');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');


function getLessons(myGroup) {
  return loadFile(path.join(__dirname, '../data/classes', myGroup, 'lessons.json')).lessons;
}

function updateLesson(fields) {
  let myGroup = fields.group;
  let myLessons = getLessons(myGroup);
  if (fields.id && fields.id != '') {
    // update
    Object.keys(fields).forEach( key => {
      if (key !== 'id') {
        if (key === 'weekdays') {
          if (fields.weekdays.length < 2) fields.weekdays = [fields.weekdays];
          myLessons.filter(item => item.id == fields.id)[0][key] = fields[key].map( item => { return Number(item) } );
        } else if (key === 'files') {
          if (!myLessons.filter(item => item.id == fields.id)[0].files) myLessons.filter(item => item.id == fields.id)[0].files = [];
          myLessons.filter(item => item.id == fields.id)[0].files.push(fields.files)
        } else {
          myLessons.filter(item => item.id == fields.id)[0][key] = fields[key];
        }
      }
    });
    saveFile(path.join(__dirname, '../data/classes', myGroup), 'lessons.json', { lessons: myLessons});
    console.log('+ Updated: lessons for class: '+myGroup);
    if (fields.lessonType === 'onlinelesson') updateOnlinelessonsCalendar(myLessons.filter(item => item.id == fields.id)[0], myGroup);
    return myLessons;
  } else {
    // add
    let newItem = {};
    newItem.id = getNewId(myLessons);
    newItem.lessonFinished = [];
    Object.keys(fields).forEach( key => {
      if (key !== 'id') {
        if (key === 'weekdays') {
          if (fields.weekdays.length < 2) fields.weekdays = [fields.weekdays];
          newItem[key] = fields[key].map( item => { return Number(item) } );
        } else {
          newItem[key] = fields[key];
        }
      }
    });
    myLessons.push(newItem);
    saveFile(path.join(__dirname, '../data/classes', myGroup), 'lessons.json', { lessons: myLessons});
    console.log('+ Added: lesson for class: '+myGroup);
    if (fields.lessonType === 'onlinelesson') updateOnlinelessonsCalendar(newItem, myGroup);
    return myLessons;
  }
}

function deleteLesson (fields) {
  let myLessons = getLessons(fields.group);
  console.log(fields);
  myLessons = myLessons.filter( item => item.id != fields.id);
  saveFile(path.join(__dirname, '../data/classes', fields.group), 'lessons.json', { lessons: myLessons});
  return myLessons;
}

function deleteFileFromLesson (group, courseId, filePath) {
  let myLessons = getLessons(group);
  if (myLessons.filter( item => item.id === courseId).length === 1) {
    let myFiles = myLessons.filter( item => item.id === courseId)[0].files;
    myLessons.filter( item => item.id === courseId)[0].files = myFiles.filter( item => item !== filePath);
    saveFile(path.join(__dirname, '../data/classes', group), 'lessons.json', { lessons: myLessons});
  } else {
    console.log('- ERROR couldn\'t find courseId: '+courseId);
  }
}

function deleteFileFromLessonFinished (group, lessonId, studentId, fileName) {
  let myLessons = getLessons(group);
  let tmpLessonFinished = myLessons.filter( lesson => lesson.id === lessonId)[0].lessonFinished;
  try {
    let filesList = tmpLessonFinished.filter( item => item.studentId === studentId)[0].files;
    filesList.splice(filesList.indexOf(fileName),1);
    tmpLessonFinished.filter( item => item.studentId === studentId)[0].files = filesList;
    myLessons.filter( lesson => lesson.id === lessonId)[0].lessonFinished = tmpLessonFinished;
  } catch (e) {
    console.log('- ERROR couldn\'t find file in list:'+e);
  }
  saveFile(path.join(__dirname, '../data/classes', group), 'lessons.json', { lessons: myLessons});
}

function finishLesson (fields) {
  let myLessons = getLessons(fields.group);
  let tmpList = myLessons.filter( item => item.id === Number(fields.courseId))[0].lessonFinished;
  let tmpObj = { studentId: Number(fields.studentId), files: [], finished: false, timeStamp: ''}
  if (tmpList.filter( item => item.studentId === Number(fields.studentId)).length === 1) {
    if (fields.finished === 'true') {
      tmpList.filter( item => item.studentId === Number(fields.studentId) )[0].finished = true;
    } else {
      tmpList.filter( item => item.studentId === Number(fields.studentId) )[0].files.push(fields.file);
      tmpList.filter( item => item.studentId === Number(fields.studentId) )[0].timeStamp = new Date();
    }
  } else {
    if (fields.file && fields.file !== '') {
      tmpObj.files.push(fields.file);
      tmpObj.timeStamp = new Date();
    } else if (fields.finished === 'true') {
      tmpObj.finished = true;
      tmpObj.timeStamp = new Date();
    }
    tmpList.push(tmpObj);
  }
  myLessons.filter( item => item.id === Number(fields.courseId))[0].lessonFinished = tmpList;
  saveFile(path.join(__dirname, '../data/classes', fields.group), 'lessons.json', { lessons: myLessons});
  return myLessons;
}

function lessonsToday (myGroup, curWeekDay, curWeek) {
  return getLessons(myGroup).filter( lesson => (lesson.weekdays.includes(curWeekDay) && isActualWeek(lesson.validFrom, lesson.validUntil, curWeek)));
}

function lessonsNotFinished (user, inDay) {
  return getLessons(user.group).filter( lesson => ((!lesson.lessonFinished.map( item => { return item.studentId } ).includes(user.id) || lesson.lessonFinished.filter( item => (item.studentId === user.id && item.finished === false)).length > 0) && notValid(lesson.validUntil, inDay) && lesson.lessonType !== 'onlinelesson'));
}

function returnedHomework (myGroup, courses=['all']) {
  let returnsList = [];
  let myLessons = getLessons(myGroup).filter( item => item.lessonFinished.length > 0);
  if (courses[0] !== 'all') {
    myLessons = myLessons.filter( item => courses.includes(item.lesson));
  }
  myLessons.forEach( lesson => {
    lesson.lessonFinished.forEach( item => {
      if (item.files.length > 0) {
        returnsList.push({
          studentId: item.studentId,
          course: lesson.lesson,
          lessonId: lesson.id,
          files: item.files,
          birthtime: item.timeStamp
        })
      }
    });
  });
  return returnsList;
}

// Additional functions

function getNewId (lessons) {
  return Math.max(...lessons.map( item => item.id)) + 1;
}

function blancLesson () {
  return {
    id: '',
    group: '',
    lessonType: 'homelesson',
    lesson: '',
    chapter: '',
    details: '',
    returnHomework: 'false',
    startWeek: '',
    weekAmount: '1',
    validFrom: '',
    validUntil: '',
    amount: '',
    weekdays: '',
    time: ''
  }
}

function updateOnlinelessonsCalendar (myLesson, myGroup) {
  let onlinelessonsCalendar = [];
  if (fs.existsSync(path.join(__dirname, '../data/classes/', myGroup, 'onlinelessonscalendar.json'))) {
    onlinelessonsCalendar = loadFile(path.join(__dirname, '../data/classes/', myGroup, 'onlinelessonscalendar.json'));
  }
  if (onlinelessonsCalendar.filter( item => item.id === myLesson.id).length > 0) {
    let tmpObj = onlinelessonsCalendar.filter( item => item.id === myLesson.id)[0];
    tmpObj.date = getWebDate(myLesson.validFrom, myLesson.weekdays[0]);
    tmpObj.time = myLesson.time;
    saveFile(path.join(__dirname, '../data/classes', myGroup), 'onlinelessonscalendar.json', onlinelessonsCalendar);
  } else {
    onlinelessonsCalendar.push({
      id: myLesson.id,
      date: getWebDate(myLesson.validFrom, myLesson.weekdays[0]),
      time: myLesson.time
    });
    saveFile(path.join(__dirname, '../data/classes', myGroup), 'onlinelessonscalendar.json', onlinelessonsCalendar);
  }
  console.log('+ Updated: onlinelessonscalendar.json for class: '+myGroup);
}


module.exports = { getLessons, updateLesson, deleteLesson, finishLesson, lessonsToday, lessonsNotFinished, deleteFileFromLesson, deleteFileFromLessonFinished, returnedHomework, blancLesson };
