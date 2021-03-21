/*!
 * main/admin-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { updateSettings } = require('./models/model-config');
const { updateGroupConfig, addNewGroup, advanceGroup } = require('./models/model-group');
const { updateUser, getUserById, getAllUsers, advanceUsers } = require('../user/models/model-user');
const getNaviObj = require('../lib/getNaviObj');
const adminView = require('./views/admin-view');
const editUserView = require('./views/edit-user-view');
const groupSettingsView = require('./views/group-settings-view');
const schoolSettingsView = require('./views/school-settings-view');
const view = require('../main/views/base-view');


function adminController (request, response, wss, wsport, user) {
  let naviObj = getNaviObj(user);
  if (request.url.startsWith('/admin/edituser')) {
    editUserAction(request, response, naviObj);
  } else if (request.url.startsWith('/admin/updateuser')) {
    updateUserAction(request, response);
  } else if (request.url.startsWith('/admin/settings')) {
    settingsAction(request, response, naviObj);
  } else if (request.url.startsWith('/admin/school')) {
    schoolAction(request, response, naviObj);
  } else {
    uniSend(view(wsport, naviObj, adminView(user)), response);
  }
}


// Additional functions

function editUserAction (request, response, naviObj) {
  let group = request.url.split('?')[1];
  let allUsers = getAllUsers();
  if (group !== undefined) {
    allUsers = allUsers.filter( item => item.group.includes(group) );
  }
  let allUserIds = allUsers.map( item => { return [item.id, item.fname+' '+item.lname+', '+item.group] } );
  allUserIds.unshift('');
  if (request.url.split('/')[3] != undefined && Number.isInteger(Number(request.url.split('/')[3]))) {
    uniSend(view('', naviObj, editUserView(allUserIds, getUserById(Number(request.url.split('/')[3])))), response);
  } else {
    let newUser = {
      userId: '',
      id: '',
      password: '',
      role: '',
      group: '',
      courses: '',
      fname: '',
      lname: '',
      email: '',
      phone: '',
      gender: ''
    };

    uniSend(view('', naviObj, editUserView(allUserIds, newUser)), response);
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
        uniSend(new SendObj(302, [], '', '/admin/settings?'+data.fields.group), response);
      } else if (data.fields.action === 'addgroup') {
        addNewGroup(data.fields);
        uniSend(new SendObj(302, [], '', '/admin/settings?'+data.fields.newGroup), response);
      } else if (data.fields.action === 'updategroupsettings') {
        updateGroupConfig(data.fields);
        uniSend(new SendObj(302, [], '', '/admin/settings?'+data.fields.group), response);
      } else if (data.fields.action === 'advancegroup') {
        advanceGroup(data.fields);
        advanceUsers(data.fields);
        uniSend(new SendObj(302, [], '', '/admin/settings?'+data.fields.newGroup), response);
      }
      uniSend(view('', naviObj, groupSettingsView(group)),response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update settings: '+error.message);
  });
}

function schoolAction (request, response, naviObj) {
  getFormObj(request).then(
    data => {
      if (data.fields.action === 'updatesettings') {
        updateSettings(data.fields);
        uniSend(new SendObj(302, [], '', '/admin/school'), response);
      } else if (data.fields.action === 'addgroup') {
        addNewGroup(data.fields);
        uniSend(new SendObj(302, [], '', '/admin/settings?'+data.fields.newGroup), response);
      }
      uniSend(view('', naviObj, schoolSettingsView()),response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update settings: '+error.message);
  });
}


module.exports = adminController;
