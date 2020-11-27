/*!
 * controllers/user-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend } = require('webapputils-ds');
const { thisWeek, thisDay } = require('../lib/dateJuggler');
const { getLessons } = require('../models/model-lessons');
const getNaviObj = require('../views/lib/getNaviObj');
const studentView = require('../views/student/view');
const studentDayView = require('../views/student/day-view');
const teacherView = require('../views/teacher/view');
const teacherLessonsView = require('../views/teacher/lessons-view');
const teacherClassesView = require('../views/teacher/classes-view');
const teacherSingleLessonView = require('../views/teacher/single-lesson-view');
const timetableView = require('../views/timetable-view');
const boardView = require('../views/board/view');
const comView = require('../views/communication-view');
const view = require('../views/view');

let myGroup = '';
let myLessons = [];


function userController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let curWeek = thisWeek();
  let curDay = thisDay();
  if (route.split('/')[0] === 'timetable' && Number.isInteger(Number(route.split('/')[2]))) {
    curWeek = Number(route.split('/')[2]);
  }
  if (route.split('/')[1] === 'day' && Number.isInteger(Number(route.split('/')[2]))) {
    curDay = Number(route.split('/')[2]);
  }
  let naviObj = getNaviObj(user);
  if (route.includes('communication')) {
    uniSend(view(wsport, naviObj, comView(user, wsport)), response);
  } else if (user.role === 'teacher') {
    // Teacher only
    // TODO: Prevent illegal URLs
    if (route.startsWith('teacher/classes')) {
      myGroup = route.split('/')[2];
      uniSend(view(wsport, naviObj, teacherClassesView(user, myGroup, wsport)), response);
    } else if (route === 'teacher/lessons') {
      uniSend(view(wsport, naviObj, teacherLessonsView(user)), response);
    } else if (route.startsWith('teacher/lessons')) {
      uniSend(view(wsport, naviObj, teacherSingleLessonView(user, route)), response);
    } else if (route.startsWith('timetable')) {
      myGroup = route.split('/')[1];
      myLessons = getLessons(myGroup);
      uniSend(view(wsport, naviObj, timetableView(myLessons, myGroup, curWeek)), response);
    } else if (route.startsWith('board')) {
      uniSend(view(wsport, naviObj, boardView(myGroup)), response);
    } else {
      uniSend(view(wsport, naviObj, teacherView(user, wsport)), response);
    }
  } else if (user.role === 'student') {
    // Student only
    myGroup = user.group;
    myLessons = getLessons(myGroup);
    if (route.split('/')[1] === 'day') {
      uniSend(view(wsport, naviObj, studentDayView(myLessons, myGroup, curDay, user)), response);
    } else if (route.startsWith('timetable')) {
      uniSend(view(wsport, naviObj, timetableView(myLessons, myGroup, curWeek)), response);
    } else if (route.startsWith('board')) {
      uniSend(view(wsport, naviObj, boardView(myGroup)), response);
    } else {
      uniSend(view(wsport, naviObj, studentView(myLessons, myGroup, curWeek, user, wsport)), response);
    }
  }
}


module.exports = userController;
