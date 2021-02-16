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
const { usersOnline, getAllUsers } = require('../../models/model-user');
const classChat = require('../templates/chat');


function classroomView (group, user, wss, wsport, recentLesson) {
  let teacherButtons = '';
  let unloadScripts = '';
  if (user.role === 'teacher') {
    teacherButtons = `
      <div class="my-3 d-flex justify-content-end">
        <button class="btn btn-sm btn-danger" onclick="window.location.replace('/classroom/${group}/endlesson');">${locale.buttons.end_onelinelesson[config.lang]}</button>
      </div>
    `;
  } else {
    unloadScripts = `
      window.addEventListener('beforeunload', function (e) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = '';
      });
      window.addEventListener('unload', function (e) {
        Cookies("classroomaccess", "");
        window.location.replace('/classroom/exitaccess');
        $.ajax({
          url: '/classroom/exitaccess', // url where to submit the request
          type : "POST", // type of action POST || GET
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
        ${teacherButtons}
      </div>
      <div class="d-flex justify-content-around mb-3">
        <div class="d-none d-xl-flex align-content-start flex-wrap p-3" style="min-width: 150px;">
          ${studentsList(recentLesson.students,2)}
        </div>
        <div class="d-block mx-3">
          ${user.role === 'teacher' ? '' : ''}
          <canvas ${user.role === 'teacher' ? 'id="myBlackboard"' : 'id="myBlackboard"'} width="1110" height="500" style="width: 1110px; height: 500px; border: 1px solid lightgrey;"></canvas>
          ${classChat([group], user)}
        </div>
        <div class="d-none d-xl-flex align-content-start flex-wrap p-3" style="min-width: 150px;">
          ${studentsList(recentLesson.students,1)}
        </div>
      </div>
    </div>
    <script>
      // Websockets
      const hostname = window.location.hostname ;
      const socket = new WebSocket('ws://'+hostname+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
      socket.onmessage = function (msg) {
        console.log(msg);
        if (msg.data === 'lessonclosed') {
          window.location.replace('/');
        } else if (msg.data === 'newstudent') {
          location.reload();
        }
        //location.reload();
        console.log(msg.data);
        //context.putImageData(msg.data, 0, 0);
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
          <div class="text-center mb-3" style="min-width: 100px;">
            ${chatterImage}<br />
            <small>${item.fname} ${item.lname}</small>
          </div>
        `;
      }
      if (oddOrEven === 1 && i%2 !== 0) {
        returnHtml += `
          <div class="text-center mb-3" style="min-width: 100px;">
            ${chatterImage}<br />
            <small>${item.fname} ${item.lname}</small>
          </div>
        `;
      }
    });
  }
  return returnHtml;
}

module.exports = classroomView;
