/*!
 * models/model-chat.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');


function getChat (myGroup) {
  let returnChat = [];
  try {
    returnChat = require(path.join(__dirname, '../data/classes', myGroup, 'chat.json'));
    return returnChat;
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

function updateChat (fields) {
  if (fields.chatterId !== '' && fields.userchat !== '') {
    let newChat = {
      chaterId: Number(fields.chatterId),
      timeStamp: new Date(),
      chat: fields.userchat
    }
    let myChat = getChat(fields.group);
    try {
      myChat.push(newChat);
      fs.writeFileSync(path.join(__dirname, '../data/classes', fields.group, 'chat.json'), JSON.stringify(myChat));
    } catch (e) {
      console.log('- ERROR writing chat to disk: '+e);
    }
  }
}


module.exports = { getChat, updateChat };
