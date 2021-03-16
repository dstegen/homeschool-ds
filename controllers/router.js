/*!
 * controllers/router.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { deliver, uniSend } = require('webapputils-ds');
const { login, logout, userLoggedIn, userDetails, setPasswordAction, updatePasswordAction } = require('./auth-controller');
const mainController = require('../main');
const adminController = require('./admin-controller');
const communicationController = require('./communication-controller');
const boardController = require('../board');
const timetableController = require('../timetable');
const classroomController = require('./classroom-controller');
const lessonsController = require('./lessons-controller');
const fileController = require('../main/file-controller');
const loginView = require('../views/auth/login-view');


function router (request, response, wss, wsport) {
  let route = request.url.substr(1).split('?')[0];
  if (route.startsWith('data/classes') || route.startsWith('data/school/pics') || request.url.includes('node_modules') || request.url.includes('public') || request.url.includes('favicon')) {
   deliver(request, response);
  } else if (route === 'login') {
    login(request, response);
  } else if (route === 'logout') {
    logout(request, response);
  } else if (userLoggedIn(request)) {
    let user = userDetails(request);
    if (route.startsWith('communication')) {
      communicationController(request, response, wss, wsport, user)
    } else if (route.startsWith('classroom')) {
      classroomController(request, response, wss, wsport, user);
    } else if (route.startsWith('board')) {
      boardController(request, response, user);
    } else if (route.startsWith('timetable')) {
      timetableController(request, response, user);
    } else if (route.startsWith('lessons')) {
      lessonsController(request, response, user);
    } else if (route.startsWith('file')) {
      fileController(request, response, user);
    } else if (route === 'setpassword') {
      setPasswordAction(request, response);
    } else if (route === 'updatepassword') {
      updatePasswordAction(request, response);
    } else if (user.role === 'admin') {
      adminController(request, response, wss, wsport, user);
    } else {
      mainController(request, response, wss, wsport, user);
    }
  } else {
    uniSend(loginView(), response);
  }
}


module.exports = router;
