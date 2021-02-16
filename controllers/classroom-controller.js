/*!
 * controllers/classroomView-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid').v4;
const { uniSend, getFormObj, SendObj, cookie } = require('webapputils-ds');
const getNaviObj = require('../views/lib/getNaviObj');
const classroomView = require('../views/classroom/view');
const lobbyView = require('../views/classroom/lobby-view');
const teacherView = require('../views/classroom/teacher-view');
const view = require('../views/view');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');

let myGroup = '';


function classroomController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  console.log('Route: '+route);
  let naviObj = getNaviObj(user);
  if (user.role === 'student') {
    myGroup = user.group;
    let recentLesson = loadFile(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.json'));
    if (accessGranted(request, recentLesson)) {
      uniSend(view('', naviObj, classroomView(myGroup, user, wss, wsport, recentLesson)), response);
    } else if (route.startsWith('classroom/requestaccess')) {
      grantAccess(response, recentLesson, user, wss);
    } else if (route.startsWith('classroom/exitaccess')) {
      exitAccess(recentLesson, user);
    } else {
      uniSend(view('', naviObj, lobbyView(recentLesson)), response);
    }
  } else if (user.role === 'teacher') {
    myGroup = route.split('/')[1];
    let recentLesson = loadFile(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.json'));
    if (route.startsWith('classroom') && route.includes('create')) {
      createOnlinelesson(request, response, myGroup);
    } else if (accessGranted(request, recentLesson)) {
      if (route.startsWith('classroom') && route.includes('endlesson')) {
        endOnlinelesson(request, response, myGroup, wss);
      } else if (route.startsWith('classroom') && route.includes('update')) {
        updateClassroom(request, response, wss, wsport, user);
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

function createOnlinelesson (request, response, myGroup) {
  getFormObj(request).then(
    data => {
      let recentLesson = {
        key: uuidv4(),
        lesson: data.fields.lessonName,
        group: myGroup,
        students: [],
        timeStamp: new Date()
      };
      saveFile(path.join(__dirname, '../data/classes', myGroup.toString()), 'onlinelesson.json', recentLesson);
      uniSend(new SendObj(302, ['classroomaccess='+recentLesson.key+'; path=/'], '', '/classroom/'+myGroup), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t create onlinelesson: '+error.message);
  });
}

function grantAccess (response, recentLesson, user, wss) {
  try {
    if (recentLesson.students === undefined) recentLesson.students = [];
    if (recentLesson.students.filter( item => item.id === user.id).length === 0) {
      recentLesson.students.push(user);
      saveFile(path.join(__dirname, '../data/classes', user.group.toString()), 'onlinelesson.json', recentLesson);
      wss.clients.forEach(client => {
        setTimeout(function () {
          client.send('newstudent');
        }, 100);
      });
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

function exitAccess (recentLesson, user) {
  console.log('Exit');
  recentLesson.students = recentLesson.students.filter( item => item.id !== user.id);
  saveFile(path.join(__dirname, '../data/classes', user.group.toString()), 'onlinelesson.json', recentLesson);
}

function updateClassroom (request, response, wss, wsport, user) {
  getFormObj(request).then(
    data => {
      if (request.url.includes('update')) {
        /*
        wss.clients.forEach(client => {
          setTimeout(function () {
            client.send(data.fields.ctx);
          }, 100);
        });
        */
      }
      //uniSend(new SendObj(302, [], '', '/classroom/'+request.url.substr(1).split('?')[0].split('/')[1]), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update classroom: '+error.message);
  });
}

function endOnlinelesson (request, response, myGroup, wss) {
  try {
    fs.unlinkSync(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.json'));
    wss.clients.forEach(client => {
      setTimeout(function () {
        client.send('lessonclosed');
      }, 100);
    });
    uniSend(new SendObj(302, ['classroomaccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;']), response);
  } catch (e) {
    console.log('- ERROR ending online lesson: '+e);
    uniSend(new SendObj(302), response);
  }
}


module.exports = classroomController;
