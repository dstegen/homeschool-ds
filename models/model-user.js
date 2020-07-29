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

function getUserFullName (userId) {
  let currUser = users.filter( user => user.userId === userId )[0];
  if (currUser != undefined) {
    return currUser.fname+' '+currUser.lname;
  } else {
    return '';
  }
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

// Additional functions

function loadUsers (filePath) {
  let usersLocal = [];
  try {
    usersLocal = require(filePath).users;
  } catch (e) {
    console.log('- ERROR reading ./data/school/users.json: '+e);
  }
  return usersLocal;
}


module.exports = { initUsers, getPasswdObj, getUserFullName, getUserDetails, getAllUsers, usersOnline, getUserById };
