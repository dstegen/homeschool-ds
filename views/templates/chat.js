/*!
 * views/templates/chat.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const moment = require('moment');
const { getChat, updateChat } = require('../../models/model-chat');


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
    let cssInline = 'd-inline';
    if (item.chat.split('').length > 46) cssInline = '';
    if (item.chaterId === user.id) {
      returnHtml += `
        <div class="row no-gutters mb-2">
          <div class="col-1">
            <img src="/data/school/pics/${item.chaterId}.jpg" height="40" width="40" class="img-fluid border rounded-circle"/>
          </div>
          <div class="col-9 pl-2">
            <div class="${cssInline} px-1 border rounded">${item.chat}</div>
            <div class="supersmall text-muted">${moment(item.timeStamp).format('dddd[, ] HH:MM')}</div>
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
            <div class="supersmall text-muted">${moment(item.timeStamp).format('dddd[, ] HH:MM')}</div>
          </div>
          <div class="col-1">
            <img src="/data/school/pics/${item.chaterId}.jpg" height="40" width="40" class="img-fluid border rounded-circle"/>
          </div>
        </div>

      `;
    }
  });
  return returnHtml;
}


module.exports = classChat;
