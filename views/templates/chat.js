/*!
 * views/templates/chat.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { getChat } = require('../../models/model-chat');
const { getUserById } = require('../../models/model-user');


function classChat (groupsList, user, windowLength=250) {
  let returnHtml = '';
  if (typeof(groupsList) === 'string') groupsList = [groupsList];
  groupsList.forEach( myGroup => {
    returnHtml += `
      <div class="border py-2 px-3 mb-3">
        <div class="d-flex justify-content-between">
          <h4>Klassen-Chat ${myGroup}</h4>
          <span>
            <button type="button" class="btn btn-sm btn-outline-info" id="toggle-button-${myGroup}" onclick="toggleChat('chat-window-${myGroup}')"> - </button>
          </span>
        </div>
        <div id="chat-window-${myGroup}" class="collapse show">
          <hr />
          <div id="${myGroup}" class="chat-window" style="max-height: ${windowLength}px; overflow: auto;">
            ${chatterEntry(myGroup, user)}
          </div>
          <hr />
          <form id="classChat-form" action="/chat" class="d-flex justify-content-between" method="post">
            <input type="text" name="chatterId" class="d-none" hidden value="${user.id}" />
            <input type="text" name="group" class="d-none" hidden value="${myGroup}" />
            <input type="texte" class="form-control mr-2" id="userchat" name="userchat" maxlength="128" placeholder="${user.fname}, write something..." value="" />
            <button type="submit" class="btn btn-sm btn-primary">Send</button>
          </form>
        </div>
      </div>
    `;
  });
  return returnHtml;
}


// Additional functions

function chatterEntry (myGroup, user) {
  let returnHtml = '';
  getChat(myGroup).forEach( item => {
    let chatUser = getUserById(item.chaterId);
    let chatUserName = chatUser.fname + ' ' + chatUser.lname;
    if (chatUser.role === 'teacher') {
      if (chatUser.gender && chatUser.gender === 'male') {
        chatUserName = 'Mr. ' + chatUser.lname;
      } else if (chatUser.gender && chatUser.gender === 'female') {
        chatUserName = 'Ms. ' + chatUser.lname;
      } else {
        chatUserName = 'Mr./Ms. ' + chatUser.lname;
      }
    }
    let cssInline = 'd-inline';
    if (item.chat.split('').length > 46) cssInline = '';
    let chatterImage = '<span class="p-2 small border rounded-circle">' + chatUser.fname.split('')[0] + chatUser.lname.split('')[0] + '</span>';
    if (fs.existsSync(path.join(__dirname, '../../data/school/pics/', item.chaterId+'.jpg'))) {
      chatterImage = `<img src="/data/school/pics/${item.chaterId}.jpg" height="40" width="40" class="img-fluid border rounded-circle"/>`;
    }
    if (item.chaterId === user.id) {
      returnHtml += `
        <div class="row no-gutters mb-2">
          <div class="col-1">
            ${chatterImage}
          </div>
          <div class="col-9 pl-2">
            <div class="${cssInline} px-1 border rounded">${item.chat}</div>
            <div class="supersmall text-muted">${chatUserName} | ${moment(item.timeStamp).format('dddd[, ] HH:MM')}</div>
          </div>
          <div class="col-2"></div>
        </div>
      `;
    } else {
      returnHtml += `
        <div class="row no-gutters mb-2">
          <div class="col-2"></div>
          <div class="col-9 pr-2 text-right">
            <div class="${cssInline} px-1 border rounded text-left">${item.chat}</div>
            <div class="supersmall text-muted">${chatUserName} | ${moment(item.timeStamp).format('dddd[, ] HH:MM')}</div>
          </div>
          <div class="col-1">
            ${chatterImage}
          </div>
        </div>

      `;
    }
  });
  return returnHtml;
}


module.exports = classChat;
