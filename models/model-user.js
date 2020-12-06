/*!
 * models/model-user.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const locale = require('../lib/locale');
const config = require('../models/model-config').getConfig();
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');

let users = [];


function initUsers () {
  users = loadFile(path.join(__dirname, '../data/school/users.json'), true);
}

function getPasswdObj () {
  let passwdObj = {};
  users.forEach( user => {
    passwdObj[user.userId] = user.password;
  });
  return passwdObj;
}

function getUserDetails (userId) {
  let currUser = users.filter( user => user.userId === userId )[0];
  if (currUser != undefined) {
    return currUser;
  } else {
    return {};
  }
}

function getAllUsers (group) {
  if (group !== undefined && group !== '') {
    return users.filter( user => user.group === group );
  } else {
    return users;
  }
}

function usersOnline (group) {
  let onlineUsers = [];
  try {
    let sessionIds = JSON.parse(fs.readFileSync(path.join(__dirname, '../sessionids.json')));
    let userIds = sessionIds.ids.map( user => { return Object.values(user)[0]; } )
    if ( group !== undefined && group !== '') {
      let allUsers = getAllUsers(group).filter( user => (user.role === 'student' && userIds.includes(user.userId)) );
      allUsers.forEach(user => {
        onlineUsers.push(user.fname+' '+user.lname);
      });
    } else {
      onlineUsers = userIds.length;
    }
  } catch (e) {
    console.log('- ERROR reading determing online students: '+e);
  }
  return onlineUsers;
}

function getUserById (id) {
  if (id !== '' && typeof(id) === 'number') {
    return users.filter( user => user.id === id)[0];
  } else {
    return {}
  }
}

function getTitleNameById (id, n=false) {
  if (id !== '' && typeof(id) === 'number') {
    let user = users.filter( user => user.id === id)[0];
    if (user.role === 'student') {
      return user.fname + ' ' + user.lname + ', ' + user.group;
    } else if (user.gender && user.gender === 'male' && n) {
      return locale.headlines.title_mr_n[config.lang]+' ' + user.lname;
    } else if (user.gender && user.gender === 'male') {
      return locale.headlines.title_mr[config.lang]+' ' + user.lname;
    } else if (user.gender && user.gender === 'female') {
      return locale.headlines.title_ms[config.lang]+' ' + user.lname;
    } else {
      return locale.headlines.title_div[config.lang]+' ' + user.lname;
    }
  } else {
    return {}
  }
}

function updateUser (fields) {
  if (fields.id !== '' && fields.userId !== '') {
    // update user
    let tmpObj = users.filter( user => user.id === Number(fields.id))[0];
    Object.keys(fields).forEach( key => {
      if (key !== 'id' && key !== 'password' && fields[key] !== '') {
        if (key === 'group' && fields.role === 'teacher' && typeof(fields.group) === 'string') {
          tmpObj.group = fields.group.split(',');
        } else if (key === 'courses' && fields.role === 'teacher' && typeof(fields.courses) === 'string') {
          tmpObj.courses = fields.courses.split(',');
        } else {
          tmpObj[key] = fields[key];
        }
      }
    });
  } else if (fields.userId !== '') {
    // add user
    let myPassword = '123';
    if (fields.password != '' && typeof(fields.password) === 'string') {
      myPassword = fields.password;
    }
    users.push({
      userId: fields.userId,
      id: getNewId(users),
      password: bcrypt.hashSync(myPassword),
      role: fields.role,
      group: fields.role === 'teacher' ? fields.group.split(',') : fields.group,
      courses: fields.role === 'teacher' ? fields.courses.split(',') : '',
      fname: fields.fname,
      lname: fields.lname,
      email: fields.email,
      phone: fields.phone,
      gender: fields.gender
    });
  }
  saveFile(path.join(__dirname, '../data/school'), 'users.json', users);
  console.log('+ User sucessfully added/updated: '+fields.userId);
}

function updatePassword (fields) {
  let curUser = users.filter( user => user.userId === fields.userId)[0];
  if (curUser !== undefined) {
    curUser.password = bcrypt.hashSync(fields.new_password);
    saveFile(path.join(__dirname, '../data/school'), 'users.json', users);
    console.log('+ Password sucessfully updated for userId: '+fields.userId);
  }
}


// Additional functions

function getNewId (users) {
  return Math.max(...users.map( item => item.id)) + 1;
}


module.exports = { initUsers, getPasswdObj, getUserDetails, getAllUsers, usersOnline, getUserById, getTitleNameById, updateUser, updatePassword };
