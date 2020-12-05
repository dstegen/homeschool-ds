/*!
 * views/communication/recent-messages.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getUserById } = require('../../models/model-user');
const { getLatestMessages } = require('../../models/model-messages');
const simpleList = require('../templates/simple-list');


function recentMessages (userId) {
  let itemsList = [];
  getLatestMessages(userId).forEach( item => {
    let allMessages = item.messages.filter( item => item.chaterId !== userId);
    let message = allMessages[allMessages.length-1];
    if (message !== undefined) {
      itemsList.push(`<a href="/communication">${message.chat} (${getUserById(message.chaterId).fname}, ${getUserById(message.chaterId).group})</a>`);
    }
  });
  return simpleList('', itemsList);
}

module.exports = recentMessages;
