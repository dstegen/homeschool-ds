/*!
 * lesson/index.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { thisDay, thisWeek, weekDayNumber, momentFromDay } = require('../lib/dateJuggler');
const { getLessons, updateLesson, deleteLesson, finishLesson, lessonsToday, lessonsNotFinished, blancLesson } = require('./models/model-lessons');
const getNaviObj = require('../views/lib/getNaviObj');
const studentDayView = require('./views/student-lesson-view');
const teacherLessonsView = require('./views/all-lessons-view');
const teacherSingleLessonView = require('./views/teacher-lesson-view');
const addLessonView = require('./views/add-lesson-view');
const view = require('../views/view');

let myGroup = '';


function lessonsController (request, response, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  let curDay = thisDay();
  if (user.role === 'student') {
    myGroup = user.group;
    if (route.startsWith('lessons/day')) {
      if (Number.isInteger(Number(route.split('/')[2]))) {
        curDay = Number(route.split('/')[2]);
      }
      uniSend(view('', naviObj, studentDayAction(myGroup, curDay, user)), response);
    } else if (route === 'lessons/lessonfinished') {
      finishLessonAction(request, response);
    }
  } else if (user.role === 'teacher') {
    myGroup = route.split('/')[2];
    if (route === 'lessons') {
      uniSend(view('', naviObj, teacherLessonsView(user)), response);
    } else if (route.startsWith('lessons/day')) {
      // Reformat route for teacher-lesson-view
      let tmpList = route.split('/');
      tmpList.splice(1,1,'show');
      tmpList.splice(2,1);
      route = tmpList.join('/');
      uniSend(view('', naviObj, teacherSingleLessonView(user, route)), response);
    } else if (route.startsWith('lessons/show')) {
      uniSend(view('', naviObj, teacherSingleLessonView(user, route)), response);
    } else if (route.startsWith('lessons/add')) {
      addLessonAction(request, response, user);
    } else if (route.startsWith('lessons/update')) {
      updateLessonAction(request, response);
    } else if (route.startsWith('lessons/delete')) {
      deleteLessonAction(request, response);
    }
  } else {
    uniSend(new SendObj(302), response);
  }
}


// Additional functions

function studentDayAction (myGroup, curDay, user) {
  let myLessonsToday = lessonsToday(myGroup, weekDayNumber(curDay), thisWeek(momentFromDay(curDay)));
  let lessonsNotFinishedToday = lessonsNotFinished(user, momentFromDay(curDay));
  return studentDayView(myLessonsToday, myGroup, curDay, weekDayNumber(curDay), user, lessonsNotFinishedToday);
}

function addLessonAction (request, response, user) {
  let itemObj = {};
  if (request.url.split('/')[3] != undefined) {
    let myGroup = request.url.split('/')[3];
    let myLessons = getLessons(myGroup);
    if (request.url.split('/')[4] !== undefined && Number.isInteger(Number(request.url.split('/')[4]))) {
      itemObj = myLessons.filter( item => item.id === Number(request.url.split('/')[4]))[0];
    } else {
      itemObj = blancLesson();
    }
    uniSend(view('', getNaviObj(user), addLessonView(itemObj, myGroup, user)),response);
  } else {
    uniSend(new SendObj(302), response);
  }
}

function updateLessonAction (request, response) {
  let urlPath = '/lessons';
  getFormObj(request).then(
    data => {
      updateLesson(data.fields);
      //if (data.fields.urlPath.split('/')[4] !== '') urlPath = data.fields.urlPath
      uniSend(new SendObj(302, [], '', urlPath), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update/add: '+error.message);
      uniSend(new SendObj(302, [], '', urlPath), response);
  });
}

function deleteLessonAction (request, response) {
    getFormObj(request).then(
      data => {
        deleteLesson(data.fields);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t delete item: '+error.message);
    });
    uniSend(new SendObj(302, [], '', '/lessons'), response);
}

function finishLessonAction (request, response) {
  getFormObj(request).then(
    data => {
      finishLesson(data.fields);
      uniSend(new SendObj(302, [], '', data.fields.urlPath), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t finish lesson: '+error.message);
  });
}


module.exports = lessonsController;
