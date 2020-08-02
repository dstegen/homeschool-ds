/*!
 * teacher/views/lessons-edit-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const { cookie, uniSend, getFormObj, SendObj, Auth } = require('webapputils-ds');
const authenticate = new Auth(path.join(__dirname, '../sessionids.json'));
const { initUsers, getPasswdObj, getUserFullName, getUserDetails } = require('../models/model-user');
initUsers();
const { thisWeek, thisDay, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek } = require('./dateJuggler');
const getNaviObj = require('../views/lib/getNaviObj');
const timetableView = require('../views/timetable-view');
const studentDayView = require('../student/views/day-view');
const studentView = require('../student/views/view');
const teacherLessonsView = require('../teacher/views/lessons-view');
const teacherClassesView = require('../teacher/views/classes-view');
const teacherView = require('../teacher/views/view');
const comView = require('../views/communication-view');
const loginView = require('../views/login-view');
const teacherLessonsEditView = require('../teacher/views/lessons-edit-view');
const teacherSingleLessonView = require('../teacher/views/single-lesson-view');
const view = require('../views/view');
const { getLessons, updateLesson, deleteLesson, finishLesson } = require('../models/model-lessons');
const fileUpload = require('./file-upload');
const fileDelete = require('./file-delete');
const { updateChat } = require('../models/model-chat');
const { updatePrivateMessages } = require('../models/model-messages');

let passwd = getPasswdObj();
let myLessons = {};
let myGroup = '';


function webView (request, response, wss, wsport) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    let route = request.url.substr(1).split('?')[0];
    let curWeek = thisWeek();
    let curDay = thisDay();
    if (route.split('/')[0] === 'timetable' && Number.isInteger(Number(route.split('/')[2]))) {
      curWeek = Number(route.split('/')[2]);
    }
    if (route.split('/')[1] === 'day' && Number.isInteger(Number(route.split('/')[2]))) {
      curDay = Number(route.split('/')[2]);
    }
    let user = getUserDetails(authenticate.getUserId(cookie(request).sessionid));
    switch (user.role) {
      case 'student':
      myGroup = getUserDetails(authenticate.getUserId(cookie(request).sessionid)).group;
      myLessons = getLessons(myGroup);
      if (route.split('/')[1] === 'day') {
        uniSend(view(wsport, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), studentDayView(myLessons, myGroup, curDay, getUserDetails(authenticate.getUserId(cookie(request).sessionid)).id)), response);
      } else if (route.startsWith('timetable')) {
        //curWeek = Number(route.split('/')[2]);
        uniSend(view(wsport, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), timetableView(myLessons, myGroup, curWeek)), response);
      } else if (route.includes('communication')) {
        uniSend(view(wsport, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid)), myGroup), comView(getUserDetails(authenticate.getUserId(cookie(request).sessionid)), wsport)), response);
      } else {
        uniSend(view(wsport, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), studentView(myLessons, myGroup, curWeek, getUserDetails(authenticate.getUserId(cookie(request).sessionid)), wsport)), response);
      }
        break;
      case 'teacher':
      myGroup = getUserDetails(authenticate.getUserId(cookie(request).sessionid)).group;
      if (route.split('/')[1] === 'classes') {
        let curGroup = route.split('/')[2];
        uniSend(view(wsport, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid)), myGroup), teacherClassesView(getUserDetails(authenticate.getUserId(cookie(request).sessionid)), curGroup, wsport)), response);
      } else if (route === 'teacher/lessons') {
        uniSend(view(wsport, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid)), myGroup), teacherLessonsView(getUserDetails(authenticate.getUserId(cookie(request).sessionid)))), response);
      } else if (route.startsWith('timetable')) {
        myGroup = route.split('/')[1];
        myLessons = getLessons(myGroup);
        uniSend(view(wsport, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid)), user.group), timetableView(myLessons, myGroup, curWeek)), response);
      } else if (route.startsWith('teacher/lessons')) {
        uniSend(view(wsport, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid)), myGroup), teacherSingleLessonView(getUserDetails(authenticate.getUserId(cookie(request).sessionid)), route)), response);
      } else if (route.includes('communication')) {
        uniSend(view(wsport, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid)), myGroup), comView(getUserDetails(authenticate.getUserId(cookie(request).sessionid)), wsport)), response);
      } else {
        uniSend(view(wsport, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid)), myGroup), teacherView(getUserDetails(authenticate.getUserId(cookie(request).sessionid)), wsport)), response);
      }
        break;
      case 'admin':

        break;
    }
  } else {
    uniSend(loginView(wsport), response);
  }
}

function login (request, response) {
  getFormObj(request).then(
    data => {
      uniSend(new SendObj(302, ['sessionid='+authenticate.login(passwd, data.fields.username, data.fields.password)]), response);
    }
  ).catch(
    error => {
      console.log('ERROR login: '+error.message);
  });
}

function logout (request, response) {
  authenticate.logout(cookie(request).sessionid)
  uniSend(new SendObj(302, ['sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;']), response);
}

function editAction (request, response) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    let user = getUserDetails(authenticate.getUserId(cookie(request).sessionid));
    getFormObj(request).then(
      data => {
        let myGroup = '7A1';
        if (request.url.split('/')[2] != undefined)myGroup = request.url.split('/')[2];
        myLessons = getLessons(myGroup);
        let itemObj = {};
        Object.keys(myLessons[0]).forEach( key => {
          itemObj[key] = '';
        });
        if (request.url.split('/')[3] != undefined && Number.isInteger(Number(request.url.split('/')[3]))) {
          itemObj = myLessons.filter( item => item.id === Number(request.url.split('/')[3]))[0];
        }
        uniSend(teacherLessonsEditView(itemObj, getNaviObj(user ,getUserFullName(authenticate.getUserId(cookie(request).sessionid)), user.group), myGroup, getUserDetails(authenticate.getUserId(cookie(request).sessionid))), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t edit: '+error.message);
    });
  } else {
    uniSend(loginView(), response);
  }
}

function updateAction (request, response) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    getFormObj(request).then(
      data => {
        updateLesson(data.fields);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update/add: '+error.message);
    });
    uniSend(new SendObj(302, [], '', '/teacher/lessons'), response);
  } else {
    uniSend(loginView(), response);
  }
}

function deleteAction (request, response) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    getFormObj(request).then(
      data => {
        deleteLesson(data.fields);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t delete item: '+error.message);
    });
    uniSend(new SendObj(302, [], '', '/teacher/lessons'), response);
  } else {
    uniSend(loginView(), response);
  }
}

function fileUploadAction (request, response) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    let urlPath = '';
    getFormObj(request).then(
      data => {
        let filePath = '';
        urlPath = data.fields.urlPath;
        if (getUserDetails(authenticate.getUserId(cookie(request).sessionid)).role === 'student') {
          filePath = path.join('courses', data.fields.course, data.fields.courseId, 'homework', (getUserDetails(authenticate.getUserId(cookie(request).sessionid)).id).toString());
          fileUpload(data.fields, data.files, filePath);
        } else if (getUserDetails(authenticate.getUserId(cookie(request).sessionid)).role === 'teacher') {
          filePath = path.join('courses', data.fields.course, data.fields.courseId, 'material');
          fileUpload(data.fields, data.files, filePath);
        }
        uniSend(new SendObj(302, [], '', urlPath), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t handle file upload: '+error.message);
    });
  } else {
    uniSend(loginView(), response);
  }
}

function fileDeleteAction (request, response) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    let urlPath = '';
    getFormObj(request).then(
      data => {
        urlPath = data.fields.urlPath;
        fileDelete(data.fields);
        uniSend(new SendObj(302, [], '', urlPath), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t handle file delete: '+error.message);
    });
  } else {
    uniSend(loginView(), response);
  }
}

function finishLessonAction (request, response) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    let urlPath = '';
    getFormObj(request).then(
      data => {
        urlPath = data.fields.urlPath;
        finishLesson(data.fields);
        uniSend(new SendObj(302, [], '', urlPath), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t finish lesson: '+error.message);
    });
  } else {
    uniSend(loginView(), response);
  }
}

function updateChatAction (request, response, wss, wsport) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    getFormObj(request).then(
      data => {
        updateChat(data.fields);
        try {
          wss.clients.forEach(client => {
            setTimeout(function () {
              client.send('chatUpdate')
            }, 100);
          });
        } catch (e) {
          console.log('- ERROR sending websocket message to all clients: '+e);
        }
        uniSend(new SendObj(302), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update chat: '+error.message);
    });
  } else {
    uniSend(loginView(), response);
  }
}

function updatePrivateMessagesAction (request, response, wss, wsport) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    getFormObj(request).then(
      data => {
        updatePrivateMessages(data.fields);
        try {
          wss.clients.forEach(client => {
            setTimeout(function () {
              client.send('chatUpdate')
            }, 100);
          });
        } catch (e) {
          console.log('- ERROR sending websocket message to all clients: '+e);
        }
        uniSend(new SendObj(302, [], '', '/communication'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update private messages: '+error.message);
    });
  } else {
    uniSend(loginView(), response);
  }
}


module.exports = { webView, login, logout, editAction, updateAction, deleteAction, fileUploadAction, fileDeleteAction, finishLessonAction, updateChatAction, updatePrivateMessagesAction };
