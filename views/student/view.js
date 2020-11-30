/*!
 * student/views/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { thisWeek, thisDay, weekDayNumber, formatDay, momentFromDay } = require('../../lib/dateJuggler');
const { lessonsToday, lessonsNotFinished } = require('../../models/model-lessons');
const { usersOnline } = require('../../models/model-user');
const classChat = require('../templates/chat');


function studentView (myLessons, myGroup, curWeek=thisWeek(), user={}, wsport) {
  return `
    <div id="dashboard" class="container">
      <h2 class="container d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h4>${locale.student.welcome[config.lang]} ${user.fname},</h4>
            <p>
              ${locale.student.today_is[config.lang]} ${formatDay()} ${lessonsToday(myGroup, weekDayNumber(), curWeek).length > 0 ? locale.student.and_you_have[config.lang]+' <strong>'+lessonsToday(myGroup, weekDayNumber(), curWeek).length+' '+locale.student.lessons[config.lang]+'</strong>:' : ''}
            </p>
            <ul>
              ${lessonsToday(myGroup, weekDayNumber(), curWeek).map(helperLessonsToday).join('')}
            </ul>
            <br /><br />
            ${helperLessonsNotFinished(user)}
          </div>
        </div>
        <div class="col-12 col-md-6">
          ${classChat([myGroup], user)}
          <div class="border py-2 px-3 mb-3">
            <h4>${locale.headlines.students_online[config.lang]}:</h4>
            <hr />
            <ul>
              ${usersOnline(myGroup).map( user => { return '<li>'+user+'</li>'; } ).join('')}
            </ul>
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

function helperLessonsToday (lessonObj) {
  return `<li><a href="/lessons/day">${lessonObj.lesson}: ${lessonObj.chapter}</a></li>`;
}

function helperLessonsNotFinished (user) {
  let returnHtml = '';
  let lessonsNotFinishedToday = lessonsNotFinished(user, momentFromDay(thisDay()));
  if (lessonsNotFinishedToday.length > 0) {
    lessonsNotFinishedToday.forEach( lessonObj => {
      returnHtml += `<li><a href="/lessons/day">${lessonObj.lesson}: ${lessonObj.chapter} (${locale.student.return_date[config.lang]}: ${formatDay(thisDay(lessonObj.validUntil))})</a></li>`;
    });
    return `
      <p class="text-danger">
        ${locale.student.you_have[config.lang]} <strong>${lessonsNotFinishedToday.length}</strong> ${locale.student.lessons_not_finished[config.lang]}:
      </p>
      <ul>
        ${returnHtml}
      </ul>
    `;
  } else {
    return '';
  }
}


module.exports = studentView;
