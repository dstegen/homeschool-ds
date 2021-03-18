/*!
 * timetable/index.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, SendObj } = require('webapputils-ds');
const { thisWeek } = require('../lib/dateJuggler');
const { getLessons } = require('../lesson/models/model-lessons');
const getNaviObj = require('../lib/getNaviObj');
const timetableView = require('./timetable/view');
const view = require('../main/views/base-view');

let myGroup = '';
let myLessons = [];


function timetableController (request, response, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  let curWeek = thisWeek();
  if (route.split('/')[0] === 'timetable' && Number.isInteger(Number(route.split('/')[2]))) {
    curWeek = Number(route.split('/')[2]);
  }
  if (user.role === 'student') {
    myGroup = user.group;
    myLessons = getLessons(myGroup);
    uniSend(view('', naviObj, timetableView(myLessons, myGroup, curWeek)), response);
  } else if (user.role === 'teacher') {
    myGroup = route.split('/')[1];
    myLessons = getLessons(myGroup);
    uniSend(view('', naviObj, timetableView(myLessons, myGroup, curWeek)), response);
  } else {
    uniSend(new SendObj(320), response);
  }
}


module.exports = timetableController;
