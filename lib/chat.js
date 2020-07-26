/*!
 * lib/chat.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getChat, updateChat } = require('../models/model-chat');

function classChat (groupsList, user) {
  let returnHtml = '';
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
          <div id="${myGroup}" class="chat-window" style="max-height: 250px; overflow: auto;">
            ${chatterEntry(myGroup, user)}
          </div>
          <hr />
          <form id="classChat-form" action="/chat" class="d-flex justify-content-between" method="post">
            <input type="text" name="chatterId" class="d-none" hidden value="${user.id}" />
            <input type="text" name="group" class="d-none" hidden value="${myGroup}" />
            <input type="texte" class="form-control mr-2" id="userchat" name="userchat" placeholder="${user.fname}, write something..." value="" />
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
  getChat(myGroup).forEach( (item, i) => {
    if (item.chaterId === user.id) {
      returnHtml += `
        <div class="d-flex mb-2">
          <img src="/data/school/pics/${item.chaterId}.jpg" height="25" width="25" class="border rounded-circle"/>
          <span class="ml-2 px-1 border rounded">${item.chat}</span>
        </div>
      `;
    } else {
      returnHtml += `
        <div class="d-flex justify-content-end mb-2">
          <span class="mr-2 px-1 border rounded">${item.chat}</span>
          <img src="/data/school/pics/${item.chaterId}.jpg" height="25" width="25" class="border rounded-circle"/>
        </div>
      `;
    }
  });
  return returnHtml;
}

module.exports = classChat;
