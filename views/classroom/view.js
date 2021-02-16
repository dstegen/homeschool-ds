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


function classroomView (group, user, wss, wsport) {
  return `
    <div id="classroom">
      <div class="container">
        <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
          ${locale.headlines.classroom[config.lang]} ${group}
          <span id="clock" class="d-none d-md-block">&nbsp;</span>
        </h2>
      </div>
      <div class="d-flex justify-content-around mb-3">
        <div class="d-none d-xl-flex align-content-start flex-wrap p-3" style="min-width: 150px;">
          ${studentsList(getAllUsers(group),1)}
        </div>
        <div class="d-block mx-3">
          ${user.role === 'teacher' ? '' : ''}
          <canvas ${user.role === 'teacher' ? 'id="myBlackboard"' : 'id="myBlackboard"'} width="1110" height="500" style="width: 1110px; height: 500px; border: 1px solid lightgrey;"></canvas>
          <script>
          /*
            // When true, moving the mouse draws on the canvas
            let isDrawing = false;
            let x = 0;
            let y = 0;

            const myPics = document.getElementById('myBlackboard');
            const context = myPics.getContext('2d');

            // event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

            // Add the event listeners for mousedown, mousemove, and mouseup
            myPics.addEventListener('mousedown', e => {
              x = e.offsetX;
              y = e.offsetY;
              isDrawing = true;
            });

            myPics.addEventListener('mousemove', e => {
              if (isDrawing === true) {
                drawLine(context, x, y, e.offsetX, e.offsetY);
                x = e.offsetX;
                y = e.offsetY;
              }
            });

            window.addEventListener('mouseup', e => {
              if (isDrawing === true) {
                drawLine(context, x, y, e.offsetX, e.offsetY);
                x = 0;
                y = 0;
                isDrawing = false;
              }
            });

            function drawLine(context, x1, y1, x2, y2) {
              context.beginPath();
              context.strokeStyle = 'black';
              context.lineWidth = 1;
              context.moveTo(x1, y1);
              context.lineTo(x2, y2);
              context.stroke();
              context.closePath();
            }
            */
          </script>
          ${classChat([group], user)}
        </div>
        <div class="d-none d-xl-flex align-content-start flex-wrap p-3" style="min-width: 150px;">
          ${studentsList(getAllUsers(group),2)}
        </div>
      </div>
    </div>
    <script>
      // Websockets
      const hostname = window.location.hostname ;
      const socket = new WebSocket('ws://'+hostname+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
      socket.onmessage = function (msg) {
        //location.reload();
        console.log(msg.data);
        context.putImageData(msg.data, 0, 0);
      };
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
