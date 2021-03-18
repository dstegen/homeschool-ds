/*!
 * main/index.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend } = require('webapputils-ds');
const { thisWeek, weekDayNumber } = require('../lib/dateJuggler');
const { lessonsToday } = require('../lesson/models/model-lessons');
const getNaviObj = require('../lib/getNaviObj');
const studentView = require('./views/student-view');
const teacherView = require('./views/teacher-view');
const teacherClassesView = require('./views/teacher-classes-view');
const view = require('../views/view');


function mainController (request, response, wss, wsport, user) {
  if (user.role === 'student') {
    uniSend(view(wsport, getNaviObj(user), studentView(lessonsToday(user.group, weekDayNumber(), thisWeek()), thisWeek(), user, wsport)), response);
  } else if (user.role === 'teacher') {
    let route = request.url.substr(1).split('?')[0];
    let naviObj = getNaviObj(user);
    if (route.startsWith('classes')) {
      let myGroup = route.split('/')[1];
      uniSend(view(wsport, naviObj, teacherClassesView(user, myGroup, wsport)), response);
    } else {
      uniSend(view(wsport, naviObj, teacherView(user, wsport)), response);
    }
  }
}


module.exports = mainController;
