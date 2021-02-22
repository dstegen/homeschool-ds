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
const locale = require('../lib/locale');
const config = require('../models/model-config').getConfig();
const { getTitleNameById } = require('../models/model-user');
const { uniSend, getFormObj, SendObj, cookie } = require('webapputils-ds');
const { getLessons } = require('../models/model-lessons');
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
  let recentLesson = {};
  if (user.role === 'student') {
    myGroup = user.group;
    if (fs.existsSync(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.json'))) {
      recentLesson = loadFile(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.json'));
    }
    if (accessGranted(request, recentLesson)) {
      if (route.startsWith('classroom/signal')) {
        signalTeacher(request, response, user, wss, wsport, recentLesson);
      } else if (route.startsWith('classroom/exitaccess')) {
        exitAccess(response, wss, recentLesson, user);
      } else {
        naviObj = {
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
        uniSend(view('', naviObj, classroomView(myGroup, user, wss, wsport, recentLesson)), response);
      }
    } else if (route.startsWith('classroom/requestaccess')) {
      grantAccess(response, recentLesson, user, wss);
    } else {
      uniSend(view('', naviObj, lobbyView(recentLesson)), response);
    }
  } else if (user.role === 'teacher') {
    myGroup = route.split('/')[1];
    if (fs.existsSync(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.json'))) {
      recentLesson = loadFile(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.json'));
    }
    if (route.startsWith('classroom') && route.includes('create')) {
      createOnlinelesson(request, response, myGroup);
    } else if (accessGranted(request, recentLesson)) {
      if (route.startsWith('classroom') && route.includes('endlesson')) {
        endOnlinelesson(request, response, myGroup, wss);
      } else if (route.startsWith('classroom') && route.includes('updatechalkboard')) {
        updateChalkboard(request, response, wss, wsport, user);
      } else if (route.startsWith('classroom') && route.includes('cleanchalkboard')) {
        cleanChalkboard(request, response, wss, myGroup);
      } else if (route.startsWith('classroom') && route.includes('update')) {
        updateClassroom(request, response, wss, wsport, user, myGroup);
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
      let newUuid = uuidv4();
      let recentLesson = {
        key: newUuid,
        id: newUuid,
        lesson: data.fields.lessonName,
        group: myGroup,
        files: [],
        videos: data.fields.videos !== '' ? data.fields.videos.replace(/\s/g, '').split(',') : [], // Test-YT-IDs: 'ksCrRr6NBg0','Wbfp4_HQQPM'
        links: [],
        students: [],
        timeStamp: new Date()
      };
      if (data.fields.lessonName === '' && typeof(Number(data.fields.lessonId)) === 'number') {
        let myLesson = getLessons(myGroup).filter( item => item.id === Number(data.fields.lessonId))[0];
        recentLesson.lesson = myLesson.lesson + ' - ' + myLesson.chapter;
        recentLesson.id = myLesson.id;
        if (myLesson.files && myLesson.files.length > 0) recentLesson.files = myLesson.files;
        if (myLesson.videos && myLesson.videos.length > 0) recentLesson.videos = myLesson.videos;
        if (myLesson.links && myLesson.links.length > 0) recentLesson.links = myLesson.links;
      }
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
    if (recentLesson.students.filter( item => item.id === user.id).length === 0 && recentLesson.group === user.group) {
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

function exitAccess (response, wss, recentLesson, user) {
  try {
    recentLesson.students = recentLesson.students.filter( item => item.id !== user.id);
    saveFile(path.join(__dirname, '../data/classes', user.group.toString()), 'onlinelesson.json', recentLesson);
    wss.clients.forEach(client => {
      setTimeout(function () {
        client.send('newstudent');
      }, 100);
    });
    uniSend( new SendObj(302, ['classroomaccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'], '', '/'), response);
  } catch (e) {
    console.log('- ERROR online lesson already closed! '+e);
    uniSend( new SendObj(302, [], '', '/'), response);
  }
}

function signalTeacher (request, response, user, wss) {
  try {
    wss.clients.forEach(client => {
      setTimeout(function () {
        client.send(JSON.stringify(['signal', user.id]));
      }, 100);
    });
    uniSend(new SendObj(200), response);
  } catch (e) {
    console.log('ERROR can\'t update classroom: '+e);
  }
}

function updateClassroom (request, response, wss, wsport, user, myGroup) {
  try {
    wss.clients.forEach(client => {
      setTimeout(function () {
        client.send('updateclassroom');
      }, 100);
    });
    uniSend(new SendObj(302, [], '', '/classroom/'+myGroup), response);
  } catch (e) {
    console.log('ERROR can\'t update classroom: '+e);
    uniSend(new SendObj(302, [], '', '/classroom/'+myGroup), response);
  }
}

function updateChalkboard (request, response, wss) {
  getFormObj(request).then(
    data => {
      try {
        let fileBuffer = new Buffer.from(data.fields.data.split(',')[1], 'base64');
        saveFile(path.join(__dirname, '../data/classes', data.fields.group.toString()), 'onlinelesson.png', fileBuffer, true);
      } catch (e) {
        console.log('- ERROR saving chalkboard: '+e);
      }
      wss.clients.forEach(client => {
        setTimeout(function () {
          client.send(data.fields.data);
        }, 100);
      });
      //uniSend(new SendObj(200), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update chalkboard: '+error.message);
  });
}

function cleanChalkboard (request, response, wss, myGroup) {
  try {
    wss.clients.forEach(client => {
      setTimeout(function () {
        client.send('cleanchalkboard');
      }, 100);
    });
    fs.unlinkSync(path.join(__dirname, '../data/classes', myGroup, 'onlinelesson.png'));
    uniSend(new SendObj(302, [], '', '/classroom/'+myGroup), response);
  } catch (e) {
    console.log('- ERROR cleaning chalkboard: '+e);
    uniSend(new SendObj(302, [], '', '/classroom/'+myGroup), response);
  }
}

function endOnlinelesson (request, response, myGroup, wss) {
  try {
    fs.unlinkSync(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.json'));
    fs.unlinkSync(path.join(__dirname, '../data/classes', myGroup.toString(), 'onlinelesson.png'));
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
