/*!
 * controllers/classroomView-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const locale = require('../lib/locale');
const config = require('../models/model-config').getConfig();
const { getTitleNameById } = require('../models/model-user');
const { uniSend, getFormObj, SendObj, cookie } = require('webapputils-ds');
const { createOnlinelesson, getRecentLesson, disposeOnlinelesson, joinOnlinelesson, exitOnlinelesson } = require('../models/model-classroom');
const getNaviObj = require('../views/lib/getNaviObj');
const classroomView = require('../views/classroom/view');
const lobbyView = require('../views/classroom/lobby-view');
const teacherView = require('../views/classroom/teacher-view');
const view = require('../views/view');
const saveFile = require('../utils/save-file');
const { registerWs, sendWsMessage } = require('../lib/websockets');

let myGroup = '';


function classroomController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  let recentLesson = {};
  if (user.role === 'student') {
    myGroup = user.group;
    recentLesson = getRecentLesson(myGroup);
    if (accessGranted(request, recentLesson)) {
      if (route.startsWith('classroom/signal')) {
        signalTeacher(request, response, user, wss, wsport, recentLesson);
      } else if (route.startsWith('classroom/exitaccess')) {
        exitAccess(response, wss, recentLesson, user);
      } else {
        uniSend(view('', simpleNaviObj(config, locale, user), classroomView(myGroup, user, wss, wsport, recentLesson)), response);
      }
    } else if (route.startsWith('classroom/requestaccess')) {
      grantAccess(response, recentLesson, user, wss);
    } else {
      uniSend(view('', naviObj, lobbyView(recentLesson)), response);
    }
  } else if (user.role === 'teacher') {
    myGroup = route.split('/')[1];
    recentLesson = getRecentLesson(myGroup);
    if (route.startsWith('classroom') && route.includes('create')) {
      startOnlinelesson(request, response, wss, myGroup, user);
    } else if (accessGranted(request, recentLesson)) {
      if (route.startsWith('classroom') && route.includes('endlesson')) {
        endOnlinelesson(request, response, myGroup, wss, recentLesson);
      } else if (route.startsWith('classroom') && route.includes('updatechalkboard')) {
        updateChalkboard(request, response, wss, wsport, user, recentLesson);
      } else if (route.startsWith('classroom') && route.includes('cleanchalkboard')) {
        cleanChalkboard(request, response, wss, myGroup, recentLesson);
      } else if (route.startsWith('classroom') && route.includes('update')) {
        updateClassroom(request, response, wss, wsport, user, myGroup, recentLesson);
      } else if (route.startsWith('classroom')) {
        uniSend(view('', naviObj, classroomView(myGroup, user, wss, wsport, recentLesson)), response);
      }
    } else {
      uniSend(view('', naviObj, teacherView(myGroup)), response);
    }
  } else {
    uniSend(new SendObj(302), response);
  }
}


// Additional functions

function simpleNaviObj (config, locale, user) {
  return {
    school: config.schoolName,
    loginname: locale.headlines.navi_student[config.lang]+': '+getTitleNameById(user.id),
    loggedin: true,
    home: {
      name: 'HomeSchool-DS',
      link: '/'
    },
    menuItems: [],
    newMessages: '0'
  }
}


// Teachers addidtional functions

function startOnlinelesson (request, response, wss, myGroup, user) {
  getFormObj(request).then(
    data => {
      let recentLesson = createOnlinelesson(data, myGroup, user);
      registerWs(wss, recentLesson.key, user.id);
      uniSend(new SendObj(302, ['classroomaccess='+recentLesson.key+'; path=/'], '', '/classroom/'+myGroup), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t create onlinelesson: '+error.message);
  });
}

function updateClassroom (request, response, wss, wsport, user, myGroup, recentLesson) {
  sendWsMessage(wss, recentLesson.key, 'updateclassroom');
  uniSend(new SendObj(302, [], '', '/classroom/'+myGroup), response);
}

function updateChalkboard (request, response, wss, recentLesson) {
  getFormObj(request).then(
    data => {
      try {
        let fileBuffer = new Buffer.from(data.fields.data.split(',')[1], 'base64');
        saveFile(path.join(__dirname, '../data/classes', data.fields.group.toString()), 'onlinelesson.png', fileBuffer, true);
      } catch (e) {
        console.log('- ERROR saving chalkboard: '+e);
      }
      sendWsMessage(wss, recentLesson.key, data.fields.data);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update chalkboard: '+error.message);
  });
}

function cleanChalkboard (request, response, wss, myGroup, recentLesson) {
  try {
    sendWsMessage(wss, recentLesson.key, 'cleanchalkboard');
    if (fs.existsSync(path.join(__dirname, '../data/classes', recentLesson.group, 'onlinelesson.png'))) {
      fs.unlinkSync(path.join(__dirname, '../data/classes', recentLesson.group, 'onlinelesson.png'));
    }
    uniSend(new SendObj(302, [], '', '/classroom/'+myGroup), response);
  } catch (e) {
    console.log('- ERROR cleaning chalkboard: '+e);
    uniSend(new SendObj(302, [], '', '/classroom/'+myGroup), response);
  }
}

function endOnlinelesson (request, response, myGroup, wss, recentLesson) {
  try {
    disposeOnlinelesson(recentLesson);
    sendWsMessage(wss, recentLesson.key, 'lessonclosed');
    uniSend(new SendObj(302, ['classroomaccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;']), response);
  } catch (e) {
    console.log('- ERROR ending online lesson: '+e);
    uniSend(new SendObj(302), response);
  }
}


// Students additional functions

function grantAccess (response, recentLesson, user, wss) {
  try {
    if (joinOnlinelesson(recentLesson, user)) {
      registerWs(wss, recentLesson.key, user.id);
      sendWsMessage(wss, recentLesson.key, 'newstudent');
    }
    uniSend(new SendObj(302, ['classroomaccess='+recentLesson.key+'; path=/'], '', '/classroom'), response);
  } catch (e) {
    console.log('- ERROR granting access to user '+user.fname+' '+user.lname+' : '+e);
  }
}

function accessGranted (request, recentLesson) {
  if (cookie(request).classroomaccess && cookie(request).classroomaccess === recentLesson.key) {
    return true;
  } else {
    return false;
  }
}

function exitAccess (response, wss, recentLesson, user) {
  try {
    exitOnlinelesson(recentLesson, user);
    sendWsMessage(wss, recentLesson.key, 'newstudent');
    uniSend( new SendObj(302, ['classroomaccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'], '', '/'), response);
  } catch (e) {
    console.log('- ERROR online lesson already closed! '+e);
    uniSend( new SendObj(302, [], '', '/'), response);
  }
}

function signalTeacher (request, response, user, wss, wsport, recentLesson) {
  sendWsMessage(wss, recentLesson.key, JSON.stringify(['signal', user.id]));
  uniSend(new SendObj(200), response);
}


module.exports = classroomController;
