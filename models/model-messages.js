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
const uuidv4 = require('uuid').v4;
const { dateIsRecent } = require('../lib/dateJuggler');


function getPrivateMessages (userId) {
  let messages = [];
  try {
    messages = loadPrivateMessages();
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
    messages = loadPrivateMessages();
    return messages.filter( item => (item.chatMates.includes(userId) && dateIsRecent(item.timeStamp, 5)));
  } catch (e) {
    console.log('- ERROR reading private messages file: '+e);
    return '';
  }
}

function updatePrivateMessages (fields) {
  let allMessages = loadPrivateMessages();
  if (fields.privateMessageId === '' || fields.privateMessageId === undefined) {
    if (allMessages.filter( item => item.chatMates.includes(Number(fields.chatterId)) ).filter(item => item.chatMates.includes(Number(fields.chatMate)) ).length > 0) {
      fields.privateMessageId = allMessages.filter( item => item.chatMates.includes(Number(fields.chatterId)) ).filter(item => item.chatMates.includes(Number(fields.chatMate)))[0].id;
      addPrivateMessage(allMessages, fields);
    } else {
      createNewPrivateMessage(allMessages ,fields);
    }
  } else if (fields.chatterId !== '' && fields.userchat !== '' && fields.privateMessageId !== '') {
    addPrivateMessage(allMessages, fields);
  }
}


// Additional functions

function addPrivateMessage (allMessages, fields) {
  let newMessage = {
    chaterId: Number(fields.chatterId),
    timeStamp: new Date(),
    chat: fields.userchat
  }
  try {
    //let allMessages = loadPrivateMessages();
    allMessages.filter( item => item.id === fields.privateMessageId)[0].messages.push(newMessage);
    allMessages.filter( item => item.id === fields.privateMessageId)[0].updated = new Date();
    fs.writeFileSync(path.join(__dirname, '../data/school', 'private-messages.json'), JSON.stringify(allMessages));
  } catch (e) {
    console.log('- ERROR writing private messages to disk: '+e);
  }
}

function createNewPrivateMessage (allMessages,fields) {
  let newCom = {
    chatMates: [Number(fields.chatterId),Number(fields.chatMate)],
    updated: new Date(),
    id: uuidv4(),
    messages: [
      {
        chaterId: Number(fields.chatterId),
        timeStamp: new Date(),
        chat: fields.userchat
      }
    ]
  }
  //console.log(newCom);
  try {
    allMessages.push(newCom);
    //fs.writeFileSync(path.join(__dirname, '../data/school', 'private-messages.json'), JSON.stringify(allMessages));
  } catch (e) {
    console.log('- ERROR creating new private message to disk: '+e);
  }
}

function loadPrivateMessages () {
  let allMessages = [];
  try {
    allMessages = require(path.join(__dirname, '../data/school', 'private-messages.json'));
  } catch (e) {
    console.log('- ERROR reading all private messages from disk: '+e);
  }
  return allMessages;
}


module.exports = { getPrivateMessages, getLatestMessages, updatePrivateMessages };
