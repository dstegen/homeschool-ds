/*!
 * controllers/teacher-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend } = require('webapputils-ds');
const getNaviObj = require('../views/lib/getNaviObj');
const teacherView = require('../views/teacher/view');
const teacherClassesView = require('../views/teacher/classes-view');
const view = require('../views/view');


function teacherController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (route.startsWith('classes')) {
    let myGroup = route.split('/')[1];
    uniSend(view(wsport, naviObj, teacherClassesView(user, myGroup, wsport)), response);
  } else {
    uniSend(view(wsport, naviObj, teacherView(user, wsport)), response);
  }
}


module.exports = teacherController;
