/*!
 * models/model-messages.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');

function getPrivateMessages (teacherId=0, studentId=0) {
  let messages = [];
  try {
    messages = require(path.join(__dirname, '../data/school', 'private-messages.json'));
    if (teacherId > 0) {
      return messages.filter( item => item.teacherId === teacherId);
    } else if (studentId > 0) {
      return messages.filter( item => item.studentId === studentId);
    } else {
      throw new Error();
    }
  } catch (e) {
    console.log('- ERROR reading chat file: '+e);
    return [
      {
        "chaterId": 0,
        "timeStamp": new Date(),
        "chat": "Error, chat not available at the moment..."
      }
    ]
  }
}

function updatePrivateMessages (fields) {
  /*
  if (fields.chatterId !== '' && fields.userchat !== '') {
    let newMessage = {
      chaterId: Number(fields.chatterId),
      timeStamp: new Date(),
      chat: fields.userchat
    }
    let myMessages = getPrivateMessages();
    try {
      myMessages.push(newMessage);
      fs.writeFileSync(path.join(__dirname, '../data/school', 'private-messages.json'), JSON.stringify(myMessages));
    } catch (e) {
      console.log('- ERROR writing chat to disk: '+e);
    }
  }
  */
}

module.exports = { getPrivateMessages, updatePrivateMessages };
