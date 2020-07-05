/*!
 * lib/controller.js
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
const studentWeekView = require('../student/views/week-view');
const studentDayView = require('../student/views/day-view');
const studentView = require('../student/views/view');
const teacherLessonsView = require('../teacher/views/lessons-view');
const teacherClassesView = require('../teacher/views/classes-view');
const teacherView = require('../teacher/views/view');
const viewLogin = require('../views/viewLogin');
const viewEdit = require('../views/viewEdit');
const view = require('../views/view');
const { getObj, updateItem, deleteItem } = require('./model');
let obj = getObj();

let passwd = getPasswdObj();

let myLessons = {};
let myGroup = '';

function webView (request, response, wss, wsport) {
  let route = request.url.substr(1).split('?')[0];
  let curWeek = thisWeek();
  let curDay = thisDay();
  if (route.split('/')[1] === 'week' && Number.isInteger(Number(route.split('/')[2]))) {
    curWeek = Number(route.split('/')[2]);
  }
  if (route.split('/')[1] === 'day' && Number.isInteger(Number(route.split('/')[2]))) {
    curDay = Number(route.split('/')[2]);
  }
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    let userRole = getUserDetails(authenticate.getUserId(cookie(request).sessionid)).role;
    switch (userRole) {
      case 'student':
      myGroup = getUserDetails(authenticate.getUserId(cookie(request).sessionid)).group;
      myLessons = require(path.join('../data/classes/', myGroup,'/lessons.json')).lessons;
      if (route.split('/')[1] === 'day') {
        uniSend(view(wsport, getNaviObj(userRole ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), studentDayView(myLessons, myGroup, curDay)), response);
      } else if (route.split('/')[1] === 'week') {
        uniSend(view(wsport, getNaviObj(userRole ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), studentWeekView(myLessons, myGroup, curWeek)), response);
      } else {
        uniSend(view(wsport, getNaviObj(userRole ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), studentView(myLessons, myGroup, curWeek, getUserDetails(authenticate.getUserId(cookie(request).sessionid)))), response);
      }
        break;
      case 'teacher':
      if (route.split('/')[1] === 'classes') {
        uniSend(view(wsport, getNaviObj(userRole ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), teacherClassesView(getUserDetails(authenticate.getUserId(cookie(request).sessionid)))), response);
      } else if (route.split('/')[1] === 'lessons') {
        uniSend(view(wsport, getNaviObj(userRole ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), teacherLessonsView(getUserDetails(authenticate.getUserId(cookie(request).sessionid)))), response);
      } else {
        uniSend(view(wsport, getNaviObj(userRole ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), teacherView(getUserDetails(authenticate.getUserId(cookie(request).sessionid)))), response);
      }
        break;
      case 'admin':

        break;
    }
  } else {
    uniSend(viewLogin(wsport), response);
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
    getFormObj(request).then(
      data => {
        let myGroup = '7A1';
        if (request.url.split('/')[2] != undefined)myGroup = request.url.split('/')[2];
        myLessons = require(path.join('../data/classes/', myGroup,'/lessons.json')).lessons;
        let itemObj = {};
        Object.keys(myLessons[0]).forEach( key => {
          itemObj[key] = '';
        });
        if (request.url.split('/')[3] != undefined && Number.isInteger(Number(request.url.split('/')[3]))) {
          itemObj = myLessons.filter( item => item.id === Number(request.url.split('/')[3]))[0];
        }
        uniSend(viewEdit(itemObj, getNaviObj('teacher' ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), myGroup), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t edit: '+error.message);
    });
  } else {
    uniSend(viewLogin(), response);
  }
}

function updateAction (request, response) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    getFormObj(request).then(
      data => {
        obj = updateItem(obj, data.fields);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update/add: '+error.message);
    });
    uniSend(new SendObj(302), response);
  } else {
    uniSend(viewLogin(), response);
  }
}

function deleteAction (request, response) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    getFormObj(request).then(
      data => {
        obj = deleteItem(obj, data.fields);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t delete item: '+error.message);
    });
    uniSend(new SendObj(302), response);
  } else {
    uniSend(viewLogin(), response);
  }
}

module.exports = {webView, login, logout, editAction, updateAction, deleteAction};
