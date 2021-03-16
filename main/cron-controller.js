/*!
 * main/cron-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const config = require('../models/model-config').getConfig();
const { cleanChat } = require('../models/model-chat');
const { getAllUsers, cleanLogins } = require('../user/models/model-user');
const { cleanMessages } = require('../models/model-messages');


function cronController () {
  console.log('+ Started cleanup at '+new Date());
  config.classes.forEach( group => {
    console.log('- Cleaning up chats for group '+group);
    cleanChat(group, config.delChatsAfter);
    console.log('- Cleaning up messages for group '+group);
    getAllUsers(group).forEach( user => {
      cleanMessages(user.id, config.delMessagesAfter);
    });
  });
  console.log('- Cleaning Logins...');
  cleanLogins();
}


module.exports = cronController;
