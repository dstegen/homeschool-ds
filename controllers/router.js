/*!
 * controllers/router.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { deliver, uniSend } = require('webapputils-ds');
const { login, logout, userLoggedIn, userDetails, setPasswordAction, updatePasswordAction } = require('./auth-controller');
const studentController = require('./student-controller');
const teacherController = require('./teacher-controller');
const adminController = require('./admin-controller');
const communicationController = require('./communication-controller');
const { fileUploadAction, fileDeleteAction } = require('./file-controller');
const loginView = require('../views/login-view');


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
    } else if (request.url.startsWith('/fileupload')) {
      fileUploadAction(request, response, user);
    } else if (request.url.startsWith('/filedelete')) {
      fileDeleteAction(request, response);
    } else if (route === 'setpassword') {
      setPasswordAction(request, response);
    } else if (route === 'updatepassword') {
      updatePasswordAction(request, response);
    } else if (user.role === 'student'){
      studentController(request, response, wss, wsport, user);
    } else if (user.role === 'teacher') {
      teacherController(request, response, wss, wsport, user);
    } else if (user.role === 'admin') {
      adminController(request, response, wss, wsport, user);
    }
  } else {
    uniSend(loginView(), response);
  }
}


module.exports = router;
