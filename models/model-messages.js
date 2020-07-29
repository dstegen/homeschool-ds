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
const { dateIsRecent } = require('../lib/dateJuggler');

function getPrivateMessages (userId) {
  let messages = [];
  try {
    messages = require(path.join(__dirname, '../data/school', 'private-messages.json'));
    return messages.filter( item => item.chatMates.includes(userId));
  } catch (e) {
    console.log('- ERROR reading private messages file: '+e);
    return [
      {
        "chaterId": 0,
        "timeStamp": new Date(),
        "chat": "Error, message not available at the moment..."
      }
    ];
  }
}

function getLatestMessages (userId) {
  let messages = [];
  try {
    messages = require(path.join(__dirname, '../data/school', 'private-messages.json'));
    return messages.filter( item => (item.chatMates.includes(userId) && dateIsRecent(item.timeStamp, 5)));
  } catch (e) {
    console.log('- ERROR reading private messages file: '+e);
    return '';
  }
}

function updatePrivateMessages (fields) {
  let chatMates = [fields.chatterId,fields.chatMate];
  if (fields.chatterId !== '' && fields.userchat !== '') {
    let newMessage = {
      chaterId: Number(fields.chatterId),
      timeStamp: new Date(),
      chat: fields.userchat
    }
    let allMessages = getPrivateMessages(fields.chatterId);
    try {
      allMessages.filter( item => item.chatMates === chatMates).messages.push(newMessage);
      fs.writeFileSync(path.join(__dirname, '../data/school', 'private-messages.json'), JSON.stringify(allMessages));
    } catch (e) {
      console.log('- ERROR writing chat to disk: '+e);
    }
  }
}


module.exports = { getPrivateMessages, getLatestMessages, updatePrivateMessages };
