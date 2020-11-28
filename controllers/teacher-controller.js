/*!
 * controllers/teacher-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend } = require('webapputils-ds');
const { thisWeek } = require('../lib/dateJuggler');
const { getLessons } = require('../models/model-lessons');
const { editLessonAction, updateLessonAction, deleteLessonAction } = require('./lessons-controller');
const getNaviObj = require('../views/lib/getNaviObj');
const teacherView = require('../views/teacher/view');
const teacherLessonsView = require('../views/teacher/lessons-view');
const teacherClassesView = require('../views/teacher/classes-view');
const teacherSingleLessonView = require('../views/teacher/single-lesson-view');
const timetableView = require('../views/timetable-view');
const boardView = require('../views/board/view');
const view = require('../views/view');

let myGroup = '';
let myLessons = [];


function teacherController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let curWeek = thisWeek();
  if (route.split('/')[0] === 'timetable' && Number.isInteger(Number(route.split('/')[2]))) {
    curWeek = Number(route.split('/')[2]);
  }
  let naviObj = getNaviObj(user);
  if (route.startsWith('teacher/classes')) {
    myGroup = route.split('/')[2];
    uniSend(view(wsport, naviObj, teacherClassesView(user, myGroup, wsport)), response);
  } else if (route === 'teacher/lessons') {
    uniSend(view(wsport, naviObj, teacherLessonsView(user)), response);
  } else if (route.startsWith('teacher/lessons')) {
    uniSend(view(wsport, naviObj, teacherSingleLessonView(user, route)), response);
  } else if (route.startsWith('edit')) {
    editLessonAction(request, response, wss, user);
  } else if (route.startsWith('update')) {
    updateLessonAction(request, response, wss);
  } else if (route.startsWith('delete')) {
    deleteLessonAction(request, response, wss);
  } else if (route.startsWith('timetable')) {
    myGroup = route.split('/')[1];
    myLessons = getLessons(myGroup);
    uniSend(view(wsport, naviObj, timetableView(myLessons, myGroup, curWeek)), response);
  } else if (route.startsWith('board')) {
    myGroup = route.split('/')[1];
    uniSend(view(wsport, naviObj, boardView(myGroup, 'teacher')), response);
  } else {
    uniSend(view(wsport, naviObj, teacherView(user, wsport)), response);
  }
}


module.exports = teacherController;
