/*!
 * controllers/router.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const { deliver, cookie, uniSend, getFormObj, SendObj, Auth } = require('webapputils-ds');
const { initUsers, getPasswdObj, getUserDetails } = require('../models/model-user');
const studentController = require('./student-controller');
const teacherController = require('./teacher-controller');
const adminController = require('./admin-controller');
const communicationController = require('./communication-controller');
const { fileUploadAction, fileDeleteAction } = require('./file-controller');
const loginView = require('../views/login-view');

const authenticate = new Auth(path.join(__dirname, '../sessionids.json'));
initUsers();
let passwd = getPasswdObj();


function router (request, response, wss, wsport) {
  let route = request.url.substr(1).split('?')[0];
  if (route.startsWith('data/classes') || route.startsWith('data/school/pics') || request.url.includes('node_modules') || request.url.includes('public') || request.url.includes('favicon')) {
   deliver(request, response);
  } else if (route === 'login') {
    getFormObj(request).then(
      data => {
        uniSend(new SendObj(302, ['sessionid='+authenticate.login(passwd, data.fields.username, data.fields.password)]), response);
      }
    ).catch(
      error => {
        console.log('ERROR login: '+error.message);
    });
  } else if (route === 'logout') {
    authenticate.logout(cookie(request).sessionid)
    uniSend(new SendObj(302, ['sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;']), response);
  } else if (authenticate.loggedIn(cookie(request).sessionid)) {
    let user = getUserDetails(authenticate.getUserId(cookie(request).sessionid));
    if (route.startsWith('communication')) {
      communicationController(request, response, wss, wsport, user)
    } else if (request.url.startsWith('/fileupload')) {
      fileUploadAction(request, response, user);
    } else if (request.url.startsWith('/filedelete')) {
      fileDeleteAction(request, response);
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
