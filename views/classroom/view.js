/*!
 * views/classroom/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const blackboard = require('./blackboard');
const classChat = require('../templates/chat');


function classroomView (group, user, wss, wsport, recentLesson) {
  let actionsButtons = '';
  let unloadScripts = '';
  if (user.role === 'teacher') {
    actionsButtons = `
      <div class="mt-3 d-flex justify-content-end">
        <button class="btn btn-sm btn-primary" onclick="window.location.replace('/classroom/${group}/cleanchalkboard');">Clean chalkboard</button>
        <button class="btn btn-sm btn-primary ml-3" onclick="window.location.replace('/classroom/${group}/update');">Update classroom</button>
        <button class="btn btn-sm btn-danger ml-3" onclick="window.location.replace('/classroom/${group}/endlesson');">${locale.buttons.end_onelinelesson[config.lang]}</button>
      </div>
    `;
  } else {
    actionsButtons = `
    <div class="mt-3 d-flex justify-content-end">
      <button class="btn btn-warning" onclick="signalTeacher('${group}','${user.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-index" viewBox="0 0 16 16">
          <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435a4.9 4.9 0 0 1 .106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 0 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z"/>
        </svg>
      </button>
      <button class="btn btn-danger ml-3" onclick="window.location.replace('/classroom/exitaccess');">
        Exit
      </button>
    </div>
    `;
    unloadScripts = `
      window.addEventListener('beforeunload', function (e) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = '';
      });
      window.addEventListener('unload', function (e) {
        //Cookies("classroomaccess", "");
        //window.location.replace('/classroom/exitaccess');
        $.ajax({
          url: '/classroom/exitaccess', // url where to submit the request
          type : "GET", // type of action POST || GET
          dataType : 'json', // data type
          data : {"action": "exitaccess"},
          success : function(result) {
              //console.log(result);
          }
        });
      });
    `;
  }
  return `
    <div id="classroom">
      <div class="container">
        <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
          ${locale.headlines.classroom[config.lang]} (${group}): ${recentLesson.lesson}
          <span id="clock" class="d-none d-md-block">&nbsp;</span>
        </h2>
        ${actionsButtons}
      </div>
      <div class="d-flex justify-content-around mb-3">
        <div id="studentsLeft" class="d-none d-xl-flex align-content-start flex-wrap p-3" style="min-width: 150px;">
          ${studentsList(recentLesson.students,2)}
        </div>
        <div class="d-block mx-3">
          <div>
            ${blackboard(recentLesson, user.role)}
          </div>
          <div>
            ${classChat([group], user)}
          </div>
        </div>
        <div id="studentsRight" class="d-none d-xl-flex align-content-start flex-wrap p-3" style="min-width: 150px;">
          ${studentsList(recentLesson.students,1)}
        </div>
      </div>
    </div>
    <script>
      // Websockets
      const hostname = window.location.hostname ;
      const wsProtocol = location.protocol.replace('http','ws');
      const socket = new WebSocket(wsProtocol+'//'+hostname+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
      socket.onmessage = function (msg) {
        //console.log(msg);
        if (msg.data === 'lessonclosed') {
          window.location.replace('/');
        } else if (msg.data === 'updateclassroom') {
          location.reload();
        } else if (msg.data === 'newstudent') {
          $( "#studentsLeft" ).load(window.location.href + " #studentsLeft > *" );
          $( "#studentsRight" ).load(window.location.href + " #studentsRight > *" );
        } else if (msg.data === 'chatUpdate') {
          $("#chat-window-${group}").load(window.location.href + " #chat-window-${group} > *" );
          setTimeout(function () {
            $('#'+$('.chat-window')[0].id).scrollTop($('.chat-window')[0].scrollHeight);
          }, 500);
        } else if (msg.data === 'cleanchalkboard') {
          var bb = document.getElementById('studentChalkboard');
          if (bb !== null) bb.innerHTML = '<img src="/public/blackboard.jpg" width="1110" height="625" />';
        } else if (msg.data.toString().startsWith('[')) {
          signal(JSON.parse(msg.data)[1])
        } else {
          var bb = document.getElementById('studentChalkboard');
          if (bb !== null) bb.innerHTML = '<img src="'+msg.data+'" />';
        }
      };
      ${unloadScripts}
    </script>
  `;
}


// Additional functions

function studentsList (students, oddOrEven=1) {
  let returnHtml = '';
  if (typeof(students) === 'object') {
    students.forEach((item, i) => {
      let chatterImage = '<span class="p-2 small border rounded-circle" style="width: 40px; height: 40px; display: inline-block;">' + item.fname.split('')[0] + item.lname.split('')[0] + '</span>';
      if (fs.existsSync(path.join(__dirname, '../../data/school/pics/', item.id+'.jpg'))) {
        chatterImage = `<img src="/data/school/pics/${item.id}.jpg" height="40" width="40" class="img-fluid border rounded-circle"/>`;
      }
      if (oddOrEven === 2 && i%2 === 0) {
        returnHtml += `
          <div id="${item.id}" class="text-center mb-3" style="min-width: 100px;">
            <div class="d-block">
              ${chatterImage}
              <svg style="display: none; float:right;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffc107" class="bi bi-hand-index-fill" viewBox="0 0 16 16">
                <path d="M8.5 4.466V1.75a1.75 1.75 0 0 0-3.5 0v5.34l-1.199.24a1.5 1.5 0 0 0-1.197 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.272-2.715a2 2 0 0 0-1.99-2.199h-.582a5.184 5.184 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.634 2.634 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002z"/>
              </svg>
            </div>
            <small>${item.fname} ${item.lname}</small>
          </div>
        `;
      }
      if (oddOrEven === 1 && i%2 !== 0) {
        returnHtml += `
          <div id="${item.id}" class="text-center mb-3" style="min-width: 100px;">
            <div class="d-block">
              ${chatterImage}
              <svg style="display: none; float:right;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffc107" class="bi bi-hand-index-fill" viewBox="0 0 16 16">
                <path d="M8.5 4.466V1.75a1.75 1.75 0 0 0-3.5 0v5.34l-1.199.24a1.5 1.5 0 0 0-1.197 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.272-2.715a2 2 0 0 0-1.99-2.199h-.582a5.184 5.184 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.634 2.634 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002z"/>
              </svg>
            </div>
            <small>${item.fname} ${item.lname}</small>
          </div>
        `;
      }
    });
  }
  return returnHtml;
}

module.exports = classroomView;
