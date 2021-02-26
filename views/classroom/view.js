/*!
 * views/classroom/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const attendantStudents = require('./attendant-students');
const blackboard = require('./blackboard');
const classChat = require('../templates/chat');
const classroomSockets = require('./classroom-sockets');


function classroomView (group, user, wss, wsport, recentLesson) {
  return `
    <div id="classroom">
      <div class="container">
        <h2 class="d-flex justify-content-between py-2 px-3 mt-3 border">
          ${locale.headlines.classroom[config.lang]} (${group}): ${recentLesson.lesson}
          <span id="clock" class="d-none d-md-block">&nbsp;</span>
        </h2>
      </div>
      <div class="d-flex justify-content-around mb-3">
        <div id="studentsLeft" class="d-none d-xl-flex align-content-start flex-wrap p-3 mt-5" style="min-width: 150px; max-width: 250px;">
          ${attendantStudents(recentLesson.students,2)}
        </div>
        <div id="blackboard" class="container d-block mx-3">
            ${blackboard(recentLesson, user)}
          <div>
            ${recentLesson.options.includes('classchat') ? classChat([group], user) : ''}
          </div>
        </div>
        <div id="studentsRight" class="d-none d-xl-flex align-content-start flex-wrap p-3 mt-5" style="min-width: 150px; max-width: 250px;">
          ${attendantStudents(recentLesson.students,1)}
        </div>
      </div>
    </div>
    ${classroomSockets(wsport, group)}
    <script>
      window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        e.returnValue = '';
      });
    </script>
  `;
}


module.exports = classroomView;
