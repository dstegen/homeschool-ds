/*!
 * views/student/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { formatDay } = require('../../lib/dateJuggler');
const studentLessonsNotFinished = require('../lessons/student-lessons-not-finished');
const getOnlinelessons = require('../lib/get-onlinelessons');
const simpleList = require('../templates/simple-list');
const userOnline = require('../templates/user-online');
const classChat = require('../templates/chat');


function studentView (lessonsTodayList, curWeek, user={}, wsport) {
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
              ${locale.student.today_is[config.lang]} ${formatDay()} ${lessonsTodayList.length > 0 ? locale.student.and_you_have[config.lang]+' <strong>'+lessonsTodayList.length+' '+locale.student.lessons[config.lang]+'</strong>:' : ''}
            </p>
            ${simpleList('', lessonsTodayList.map( lessonObj => { return `<a href="/lessons/day">${lessonObj.lesson}: ${lessonObj.chapter}</a>` }))}
            <br />
            ${studentLessonsNotFinished(user)}
          </div>
          <div class="border py-2 px-3 mb-3">
            <h4>${locale.headlines.scheduledOnlinelessons[config.lang]}:</h4>
            <hr />
            <h5>${locale.headlines.thisWeek[config.lang]}</h5>
            ${getOnlinelessons(user, 0)}
            <br />
            <hr />
            <h5>${locale.headlines.nextWeek[config.lang]}</h5>
            ${getOnlinelessons(user, 1)}
            <br />
          </div>
        </div>
        <div class="col-12 col-md-6">
          ${classChat([user.group], user)}
          ${userOnline([user.group], config.lang)}
        </div>
      </div>
    </div>
    <script>
      // Websockets
      const hostname = window.location.hostname ;
      const wsProtocol = location.protocol.replace('http','ws');
      const socket = new WebSocket(wsProtocol+'//'+hostname+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
      socket.onmessage = function (msg) {
        location.reload();
        console.log(msg.data);
      };
    </script>
  `;
}


module.exports = studentView;
