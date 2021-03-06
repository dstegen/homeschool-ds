/*!
 * main/templates/chat.js
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
const { getChat } = require('../../communication/models/model-chat');
const { getUserById, getTitleNameById } = require('../../user/models/model-user');


function classChat (groupsList, user, windowLength=250) {
  let returnHtml = '';
  if (typeof(groupsList) === 'string') groupsList = [groupsList];
  groupsList.forEach( myGroup => {
    returnHtml += `
      <div class="border py-2 px-3 mb-3">
        <div class="d-flex justify-content-between">
          <h4>${locale.headlines.group_chat[config.lang]} ${myGroup}</h4>
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
          <form id="classChat-form-${myGroup}" action="/communication/chat" class="d-flex justify-content-between" method="post">
            <input type="text" name="chatterId" class="d-none" hidden value="${user.id}" />
            <input type="text" name="group" class="d-none" hidden value="${myGroup}" />
            <input type="texte" class="form-control mr-2" id="userchat-${myGroup}" name="userchat" maxlength="128" placeholder="${user.fname}, ${locale.placeholder.write_something[config.lang]}" value="" />
            <button type="button" class="btn btn-sm btn-primary" onclick="sendChat('${myGroup}');">${locale.buttons.send[config.lang]}</button>
          </form>
        </div>
      </div>
      <script>
        document.getElementById('userchat-${myGroup}').addEventListener('keypress', function (e) {
          if (e.key === 'Enter') sendChat('${myGroup}');
          return false;
        });
      </script>
    `;
  });
  return returnHtml;
}


// Additional functions

function chatterEntry (myGroup, user) {
  let returnHtml = '';
  getChat(myGroup).forEach( item => {
    let chatUser = getUserById(item.chaterId);
    let chatUserName = getTitleNameById(item.chaterId);
    let cssInline = 'd-inline';
    if (item.chat.split('').length > 46) cssInline = '';
    let chatterImage = '<span class="p-2 small border rounded-circle">' + chatUser.fname.split('')[0] + chatUser.lname.split('')[0] + '</span>';
    if (fs.existsSync(path.join(__dirname, '../../data/school/pics/', item.chaterId+'.jpg'))) {
      chatterImage = `<img src="/data/school/pics/${item.chaterId}.jpg" height="40" width="40" class="img-fluid border rounded-circle"/>`;
    }
    if (item.chaterId === user.id) {
      returnHtml += `
        <div class="row no-gutters mb-2">
          <div class="col-1 d-flex justify-content-end">
            <div>
              ${chatterImage}
            </div>
          </div>
          <div class="col-9 pl-2">
            <div class="${cssInline} px-1 border rounded text-break">${item.chat}</div>
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
            <div class="${cssInline} px-1 border rounded text-left text-break">${item.chat}</div>
            <div class="supersmall text-muted">${chatUserName} | ${moment(item.timeStamp).format('dddd[, ] HH:MM')}</div>
          </div>
          <div class="col-1 d-flex justify-content-start">
            <div>
              ${chatterImage}
            </div>
          </div>
        </div>

      `;
    }
  });
  return returnHtml;
}


module.exports = classChat;
