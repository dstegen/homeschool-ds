/*!
 * student/views/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const { thisWeek, thisDay, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek, beforeFinishDate } = require('../../lib/dateJuggler');
const { initUsers, getPasswdObj, getUserFullName, getUserDetails, getAllUsers, usersOnline } = require('../../models/model-user');
const classChat = require('../../views/templates/chat');
let lessonsConfig = {};


function studentView (myLessons, myGroup, curWeek=thisWeek(), user={}, wsport) {
  lessonsConfig = require(path.join('../../data/classes/', myGroup,'/config.json'));
  let todayOff = '';
  if (myLessons.filter( item => item.weekdays.includes(weekDayNumber())).length < 1) todayOff = `<span class="text-muted">- kein Unterricht -</span>`;
  return `
    <div id="dashboard" class="container">
      <h2 class="container d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h4>Hallo ${user.fname},</h4>
            <p>
              heute ist ${formatDay()} und du hast <strong>${helperLessonsCount(myLessons, weekDayNumber(), curWeek)} Stunde/n</strong>:
            </p>
            <ul>
              ${myLessons.map(lesson => helperLessonsToday(lesson, weekDayNumber(), curWeek)).join('')}
            </ul>
            <br /><br />
            ${helperLessonsNotFinished(myLessons, curWeek, user.id)}
          </div>
        </div>
        <div class="col-12 col-md-6">
          ${classChat([myGroup], user)}
          <div class="border py-2 px-3 mb-3">
            <h4>Schüler online:</h4>
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

function helperLessonsCount (myLessons, curWeekDay, curWeek) {
  let count = 0;
  myLessons.forEach( lessonObj => {
    if (lessonObj.weekdays.includes(curWeekDay) && isActualWeek(lessonObj.validFrom, lessonObj.validUntil, curWeek)) {
      count += 1;
    }
  });
  return count;
}

function helperLessonsToday (lessonObj, curWeekDay, curWeek) {
  let returnHtml = '';
  if (lessonObj.weekdays.includes(curWeekDay) && isActualWeek(lessonObj.validFrom, lessonObj.validUntil, curWeek)) {
    returnHtml = `<li><a href="/student/day">${lessonObj.lesson}: ${lessonObj.chapter}</a></li>`;
  }
  return returnHtml;
}

function helperLessonsNotFinished (myLessons, curWeek, studentId) {
  let counter = 0;
  let returnHtml = '';
  myLessons.forEach( lessonObj => {
    if (!lessonObj.lessonFinished.includes(studentId) && isActualWeek(lessonObj.validFrom, lessonObj.validUntil, curWeek) && beforeFinishDate(lessonObj.validUntil)) {
      returnHtml += `<li><a href="/student/day">${lessonObj.lesson}: ${lessonObj.chapter} (Abgabe: ${formatDay(thisDay(lessonObj.validUntil))})</a></li>`;
      counter++;
    } else if (!lessonObj.lessonFinished.includes(studentId) && !isActualWeek(lessonObj.validFrom, lessonObj.validUntil, curWeek)) {
      returnHtml += `<li><a href="/student/day">${lessonObj.lesson}: ${lessonObj.chapter} (Abgabe: ${formatDay(thisDay(lessonObj.validUntil))})</a></li>`;
      counter++;
    }
  });
  if (counter > 0) {
    return `<p class="text-danger">
              Du hast <strong>${counter}</strong> Stunde/n <strong>noch nicht</strong> abgeschlossen:
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
