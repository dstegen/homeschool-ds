/*!
 * teacher/views/classes-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const { getAllUsers } = require('../../models/model-user');
const classChat = require('../../views/templates/chat');
const newPrivateMessage = require('../../views/templates/new-private-message');


function teacherClassesView (teacher, group, wsport) {
  return `
    <div id="class" class="container">
      <div class="mb-5">
        <div class="d-flex justify-content-between py-2 px-3 my-3 border align-items-center">
          <h2 class="mb-0">Klasse ${group}</h2>
          <span>
          <a href="#" onclick="$('#class-${group}-chat').collapse('toggle')" class="d-none d-md-inline">Klassen-Chat</a>
          <a href="/timetable/${group}" class="ml-2">Timetable</a>
          </span>
        </div>
        <div class="row" id="classParent">
          <div class="col-12 col-lg collapse show">
            <table class="table border">
              <tr>
                <th>Nr.</th>
                <th>Vorname</th>
                <th>Nachname</th>
              </tr>
              ${getAllUsers(group).filter( person => person.role === 'student').map( (item, i) => helperClassTable(item, i, group)).join('')}
            </table>
          </div>
          <div id="new-message-${group}" class="col-12 col-lg collapse" data-parent="#classParent">
            ${newPrivateMessage(teacher.id)}
          </div>
          <div id="class-${group}-chat" class="col-12 col-lg collapse" data-parent="#classParent">
            ${classChat(group, teacher, 800)}
          </div>
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


// Additional functions

function helperClassTable (item, index, group) {
  return `
    <tr>
      <td>${index+1}</td>
      <td>${item.fname}</td>
      <td>${item.lname}</td>
      <td class="d-flex justify-content-end">
        <button class="d-none btn btn-sm btn-secondary ml-2" onclick="sendEmail('${item.email}');">E-Mail</button>
        <button class="btn btn-sm btn-success ml-2" onclick="showNewPrivateMessage('${group}','${item.id}')">Nachricht</button>
      </td>
    </tr>
  `;
}


module.exports = teacherClassesView;
