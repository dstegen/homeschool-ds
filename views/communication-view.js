/*!
 * views/communication-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const fs = require('fs');
const { thisWeek, thisDay, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek, dateIsRecent } = require('../lib/dateJuggler');
const { initUsers, getPasswdObj, getUserFullName, getUserDetails, getAllUsers, usersOnline, getUserById } = require('../models/model-user');
const getRER = require('../lib/getRecentExerciseReturns');
const classChat = require('./templates/chat');
const privateMessages = require('./templates/private-messages');

function communicationView (user, wsport) {
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Communication
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
    <div class="row">
      <div class="col-12 col-md-6">
        ${newMessage(user.id)}
        ${privateMessages(user.id)}
      </div>
      <div class="col-12 col-md-6">
        ${classChat(user.group, user)}
      </div>
    </div>
  </div>
  <script>
    // Websockets
    const hostname = window.location.hostname ;
    const socket = new WebSocket('ws://'+hostname+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
    socket.onmessage = function (msg) {
      location.reload();
      console.log(msg.data);
    };
  </script>
    `;
}

function newMessage (userId='') {
  const user = getUserById(userId);
  let allUsers = [];
  let allOptions = '';
  if (user.role === 'teacher') {
    allUsers = getAllUsers().filter( item => user.group.includes(item.group));
    allOptions = allUsers.map( item => { return '<option value="'+item.id+'">'+item.fname+' '+item.lname+' ('+item.group+')</option>' }).join('')
  } else if (user.role === 'student') {
    allUsers = getAllUsers().filter( item => (item.group.includes(user.group) && item.role === 'teacher'));
    allOptions = allUsers.map( item => { return '<option value="'+item.id+'">Mr/Ms '+item.lname+'</option>' }).join('')
  }
  return `
    <div class="border py-2 px-3 mb-3">
      <form id="newMessage-form" action="/message" method="post">
        <input type="text" name="chatterId" class="d-none" hidden value="${userId}" />
        <div class="form-group form-inline justify-content-between">
          <h4>Neue Unterhaltung mit</h4>
          <select class="form-control" id="chatMate" name="chatMate">
            <option></option>
            ${allOptions}
          </select>
        </div>
        <hr />
        <div class="d-flex justify-content-between">
          <input type="texte" class="form-control mr-2" id="userchat" name="userchat" placeholder="Write something..." value="" />
          <button type="submit" class="btn btn-sm btn-primary">Send</button>
        </div>
      </form>
    </div>
  `;
}

module.exports = communicationView;
