/*!
 * controllers/admin-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { updateSettings, updateGroupConfig, addNewGroup } = require('../models/model-config');
const { updateUser, getUserById } = require('../models/model-user');
const getNaviObj = require('../views/lib/getNaviObj');
const adminView = require('../views/admin/view');
const editUserView = require('../views/admin/edit-user-view');
const settingsView = require('../views/admin/settings-view');
const view = require('../views/view');


function adminController (request, response, wss, wsport, user) {
  let naviObj = getNaviObj(user);
  if (request.url.startsWith('/admin/edituser')) {
    editUserAction(request, response, naviObj);
  } else if (request.url.startsWith('/admin/updateuser')) {
    updateUserAction(request, response);
  } else if (request.url.startsWith('/admin/settings')) {
    settingsAction(request, response, naviObj);
  } else {
    uniSend(view(wsport, naviObj, adminView(user)), response);
  }
}


// Additional functions

function editUserAction (request, response, naviObj) {
  let group = request.url.split('?')[1];
  if (request.url.split('/')[3] != undefined && Number.isInteger(Number(request.url.split('/')[3]))) {
    uniSend(view('', naviObj, editUserView(group, getUserById(Number(request.url.split('/')[3])))), response);
  } else {
    uniSend(view('', naviObj, editUserView(group)), response);
  }
}

function updateUserAction (request, response) {
  getFormObj(request).then(
    data => {
      updateUser(data.fields);
      // TODO: Update passwdObj !?
      uniSend(new SendObj(302, [], '', '/admin'), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t add/update user: '+error.message);
  });
}

function settingsAction (request, response, naviObj) {
  let group = request.url.split('?')[1];
  getFormObj(request).then(
    data => {
      if (data.fields.action === 'updatesettings') {
        updateSettings(data.fields);
        uniSend(new SendObj(302, [], '', '/admin/settings'), response);
      } else if (data.fields.action === 'addgroup') {
        addNewGroup(data.fields);
        uniSend(new SendObj(302, [], '', '/admin/settings'), response);
      } else if (data.fields.action === 'updategroupsettings') {
        updateGroupConfig(data.fields);
        uniSend(new SendObj(302, [], '', '/admin/settings'), response);
      }
      uniSend(view('', naviObj, settingsView(group)),response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update settings: '+error.message);
  });
}


module.exports = adminController;
