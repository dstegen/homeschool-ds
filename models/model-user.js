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

let users = [];


function initUsers (filePath=path.join(__dirname, '../data/school/users.json')) {
  users = loadUsers(filePath);
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
    let allUsers = getAllUsers(group).filter( user => (user.role === 'student' && userIds.includes(user.userId)) );
    allUsers.forEach(user => {
      onlineUsers.push(user.fname+' '+user.lname);
    });
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

function updateUser (fields, filePath=path.join(__dirname, '../data/school/users.json')) {
  if (fields.id !== '' && fields.userId !== '') {
    // update user
    let tmpObj = users.filter( user => user.id === Number(fields.id))[0];
    Object.keys(fields).forEach( key => {
      if (key !== 'id' && key !== 'password' && fields[key] !== '') {
        tmpObj[key] = fields[key];
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
  saveUsers(users, filePath);
}

function updatePassword (fields, filePath=path.join(__dirname, '../data/school/users.json')) {
  let curUser = users.filter( user => user.userId === fields.userId)[0];
  if (curUser !== undefined) {
    curUser.password = bcrypt.hashSync(fields.new_password);
    saveUsers(users, filePath)
    console.log('+ Password sucessfully update for userId: '+fields.userId);
  }
}

// Additional functions

function loadUsers (filePath) {
  let usersLocal = [];
  try {
    usersLocal = require(filePath);
  } catch (e) {
    console.log('- ERROR reading ./data/school/users.json: '+e);
  }
  return usersLocal;
}

function getNewId (users) {
  return Math.max(...users.map( item => item.id)) + 1;
}

function saveUsers (usersIn, filePath) {
  try {
    // TODO: Better first BACKUP!!!
    fs.writeFileSync(filePath, JSON.stringify(usersIn));
    initUsers(filePath);
  } catch (e) {
    console.log('ERROR saving new ./data/school/users.json: '+e);
  }
}


module.exports = { initUsers, getPasswdObj, getUserDetails, getAllUsers, usersOnline, getUserById, getTitleNameById, updateUser, updatePassword };
