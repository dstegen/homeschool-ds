/*!
 * main/templates/private-messages.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { getPrivateMessages } = require('../../communication/models/model-messages');
const { getUserById, getTitleNameById } = require('../../user/models/model-user');


function privateMessages (userId) {
  let allMessages = getPrivateMessages(userId);
  let returnHtml = '';
  allMessages.forEach( (msg, i) => {
    let myGroup = userId+'_'+i;
    let chatMateId = msg.chatMates.filter( id => id !== userId)[0];
    if (chatMateId > 99999) {
      returnHtml += `
        <div class="border py-2 px-3 mb-3">
          <div class="d-flex justify-content-between">
            <h4>${locale.headlines.private_chat_with[config.lang]} ${getTitleNameById(chatMateId, true)}</h4>
            <span>
              <button type="button" class="btn btn-sm btn-outline-info" id="toggle-button-${myGroup}" onclick="toggleChat('chat-window-${myGroup}')"> - </button>
            </span>
          </div>
          <div id="chat-window-${myGroup}" class="collapse show">
            <hr />
            <div id="${myGroup}" class="chat-window" style="max-height: 250px; overflow: auto;">
              ${chatterEntry(msg.messages, userId)}
            </div>
            <hr />
            <form id="classChat-form" action="/communication/message" class="d-flex justify-content-between" method="post">
              <input type="text" name="chatterId" class="d-none" hidden value="${userId}" />
              <input type="text" name="chatMate" class="d-none" hidden value="${chatMateId}" />
              <input type="text" name="privateMessageId" class="d-none" hidden value="${msg.id}" />
              <input type="texte" class="form-control mr-2" id="userchat" name="userchat" maxlength="128" placeholder="${getUserById(userId).fname}, ${locale.placeholder.write_something[config.lang]}" value="" />
              <button type="submit" class="btn btn-sm btn-primary">${locale.buttons.send[config.lang]}</button>
            </form>
          </div>
        </div>
      `;
    }
  });
  return returnHtml;
}


// Additional functions

function chatterEntry (messages, userId) {
  let returnHtml = '';
  let lastMoment = moment().day();
  messages.forEach( item => {
    let chatUser = getUserById(item.chaterId);
    let cssInline = 'd-inline';
    if (item.chat.split('').length > 46) cssInline = '';
    let chatterImage = '<span class="p-2 small border rounded-circle">' + chatUser.fname.split('')[0] + chatUser.lname.split('')[0] + '</span>';
    if (fs.existsSync(path.join(__dirname, '../../data/school/pics/', item.chaterId+'.jpg'))) {
      chatterImage = `<img src="/data/school/pics/${item.chaterId}.jpg" height="40" width="40" class="img-fluid border2 rounded-circle"/>`;
    }
    if (moment(item.timeStamp).day() !== lastMoment) {
      returnHtml += `<div class="w-100 small text-muted text-center py-3">- - - - - - - - - - ${moment(item.timeStamp).format('dddd[, ] HH:MM')} - - - - - - - - - -</div>`
    }
    if (item.chaterId === userId) {
      returnHtml += `
        <div class="row no-gutters mb-2">
          <div class="col-1">
            ${chatterImage}
          </div>
          <div class="col-9 pl-2">
            <div class="${cssInline} px-1 border2 rounded text-break">${item.chat}</div>
            <div class="d-none supersmall text-muted">${moment(item.timeStamp).format('dddd[, ] HH:MM')}</div>
          </div>
          <div class="col-2"></div>
        </div>
      `;
    } else {
      returnHtml += `
        <div class="row no-gutters mb-2">
          <div class="col-2"></div>
          <div class="col-9 pr-2 text-right">
            <div class="${cssInline} px-1 border2 rounded text-left text-break">${item.chat}</div>
            <div class="d-none supersmall text-muted">${moment(item.timeStamp).format('dddd[, ] HH:MM')}</div>
          </div>
          <div class="col-1">
            ${chatterImage}
          </div>
        </div>

      `;
    }
    lastMoment = moment(item.timeStamp).day();
  });
  return returnHtml;
}


module.exports = privateMessages;
