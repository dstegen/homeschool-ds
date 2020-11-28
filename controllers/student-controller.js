/*!
 * controllers/student-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend } = require('webapputils-ds');
const { thisWeek, thisDay } = require('../lib/dateJuggler');
const { getLessons } = require('../models/model-lessons');
const finishLessonAction = require('./lessons-controller');
const getNaviObj = require('../views/lib/getNaviObj');
const studentView = require('../views/student/view');
const studentDayView = require('../views/student/day-view');
const timetableView = require('../views/timetable-view');
const boardView = require('../views/board/view');
const view = require('../views/view');

let myGroup = '';
let myLessons = [];


function studentController (request, response, wss, wsport, user) {
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
  myGroup = user.group;
  myLessons = getLessons(myGroup);
  if (route.split('/')[1] === 'day') {
    uniSend(view(wsport, naviObj, studentDayView(myLessons, myGroup, curDay, user)), response);
  } else if (route.startsWith('timetable')) {
    uniSend(view(wsport, naviObj, timetableView(myLessons, myGroup, curWeek)), response);
  } else if (route.startsWith('board')) {
    uniSend(view(wsport, naviObj, boardView(myGroup)), response);
  } else if (route === 'student/lessonfinished') {
    finishLessonAction(request, response);
  } else {
    uniSend(view(wsport, naviObj, studentView(myLessons, myGroup, curWeek, user, wsport)), response);
  }
}


module.exports = studentController;
