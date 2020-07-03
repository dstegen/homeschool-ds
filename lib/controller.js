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
const getNaviObj = require('../views/lib/getNaviObj');
const getBody = require('../views/lib/getBody');
const viewLogin = require('../views/viewLogin');
const viewEdit = require('../views/viewEdit');
const view = require('../views/view');
const { getObj, updateItem, deleteItem } = require('./model');
let obj = getObj();

let passwd = getPasswdObj();

let myLessons = require('../data/classes/7A1/lessons.json').lessons;

function webView (request, response, wss, wsport) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    console.log(getUserDetails(authenticate.getUserId(cookie(request).sessionid)).role);
    uniSend(view(wsport, getNaviObj(getUserDetails(authenticate.getUserId(cookie(request).sessionid)).role ,getUserFullName(authenticate.getUserId(cookie(request).sessionid))), getBody(myLessons)), response);
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
        let itemObj = {};
        Object.keys(obj[0]).forEach( key => {
          itemObj[key] = '';
        });
        if (data.fields.id) itemObj = obj.filter( item => item.id == Number(data.fields.id))[0];
        uniSend(viewEdit(itemObj), response);
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
