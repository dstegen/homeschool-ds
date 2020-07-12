/*!
 * helper/user-importer.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

let startId = 900001;

function createUserListFromNames(namesList, users) {
  let userList = [];
  namesList.forEach( name => {
    let tmpObj = {};
    tmpObj.userId = name.toLowerCase().replace(' ','.')+'@me.com';
    tmpObj.id = getNextUserId(users);
    tmpObj.password = '$2a$10$Lcj1Cq9ldWV4bKrnxzVHqe1uDQwvleEQi1V5pHBcWJqRQDulOFtFa';
    tmpObj.role = 'student';
    tmpObj.group = '7A1';
    tmpObj.fname = name.split(' ')[0];
    tmpObj.lname = name.split(' ')[1];
    tmpObj.email = name.toLowerCase().replace(' ','.')+'@me.com';
    tmpObj.phone = '+49 '+getRandomInt(123456789, 987654321);
    userList.push(tmpObj);
  });
  return userList;
}


// Additional functions

function getNextUserId (users) {
  if (users === undefined ) {
    startId++;
    return startId;
  } else {
    return Math.max(...users.map( item => item.id)) + 1;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


module.exports = createUserListFromNames;
