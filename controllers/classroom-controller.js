/*!
 * controllers/classroomView-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const { uniSend, getFormObj, SendObj, cookie } = require('webapputils-ds');
const getNaviObj = require('../views/lib/getNaviObj');
const classroomView = require('../views/classroom/view');
const lobbyView = require('../views/classroom/lobby-view');
const view = require('../views/view');
const loadFile = require('../utils/load-file');

let myGroup = '';


function classroomController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (user.role === 'student') {
    myGroup = user.group;
    let recentLesson = loadFile(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.json'));
    if (accessGranted(request, recentLesson)) {
      uniSend(view('', naviObj, classroomView(myGroup, user, wss, wsport, recentLesson)), response);
    } else if (route.startsWith('classroom/requestaccess')) {
      grantAccess(response, recentLesson);
    } else {
      uniSend(view('', naviObj, lobbyView(recentLesson.lesson)), response);
    }
  } else if (user.role === 'teacher') {
    myGroup = route.split('/')[1];
    let recentLesson = loadFile(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.json'));
    if (route.startsWith('classroom') && route.includes('update')) {
      updateClassroom(request, response, wss, wsport, user);
    } else if (route.startsWith('classroom')) {
      uniSend(view('', naviObj, classroomView(myGroup, user, wss, wsport, recentLesson)), response);
    }
  } else {
    uniSend(new SendObj(302), response);
  }
}


// Additional functions

function grantAccess (response, recentLesson) {
  uniSend(new SendObj(302, ['classroomaccess='+recentLesson.key+'; path=/'], '', '/classroom'), response);
}

function accessGranted (request, recentLesson) {
  if (cookie(request).classroomaccess && cookie(request).classroomaccess === recentLesson.key.toString()) {
    return true;
  } else {
    return false;
  }
}

function updateClassroom (request, response, wss, wsport, user) {
  getFormObj(request).then(
    data => {
      if (request.url.includes('update')) {
        console.log(data.fields);
        wss.clients.forEach(client => {
          setTimeout(function () {
            client.send(data.fields.ctx);
          }, 100);
        });
      }
      //uniSend(new SendObj(302, [], '', '/classroom/'+request.url.substr(1).split('?')[0].split('/')[1]), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update classroom: '+error.message);
  });
}


module.exports = classroomController;
