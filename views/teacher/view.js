/*!
 * teacher/views/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const locale = require('../../lib/locale');
const config = require('../../models/model-config')();
const { formatDay, dateIsRecent, getDaytime } = require('../../lib/dateJuggler');
const { getAllUsers, usersOnline, getUserById, getTitleNameById } = require('../../models/model-user');
const { getLatestMessages } = require('../../models/model-messages');
const getRER = require('../../lib/getRecentExerciseReturns');
const classChat = require('../templates/chat');

const lang = config.lang;


function teacherView (teacher, wsport) {
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="border py-2 px-3 mb-3">
          <h4>${helperWelcome(lang)} ${getTitleNameById(teacher.id)},</h4>
          <p>
            ${locale.teacher.today_is[lang]} ${formatDay()} ${getLatestMessages(teacher.id).length > 0 ? ' '+locale.teacher.you_have[lang]+' <strong>'+getLatestMessages(teacher.id).length+'</strong> '+locale.teacher.new_messages[lang]+':' : ''}
          </p>
          ${helperRecentMessages(teacher.id)}
          <br />
        </div>
        <div class="border py-2 px-3 mb-3">
          <h4>${locale.headlines.returned_homework[lang]}:</h4>
          <hr />
          ${returnedExercises(teacher.group, teacher.courses)}
          <br />
        </div>
      </div>
      <div class="col-12 col-md-6">
        ${classChat(teacher.group, teacher)}
        <div class="border py-2 px-3 mb-3">
          <h4>${locale.headlines.students_online[lang]}:</h4>
          <hr />
          ${studentsOnline(teacher.group)}
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

function studentsOnline (allGroups) {
  let returnHtml = '';
  allGroups.forEach( group => {
    returnHtml += `<h5>${locale.headlines.class[lang]} ${group}:</h5><ul>`;
    usersOnline(group).forEach( user => {
      returnHtml += `<li>${user}</li>`
    });
    returnHtml += `</ul>`;
  });
  return returnHtml;
}

function returnedExercises (allGroups, courses) {
  let returnHtml = '';
  allGroups.forEach( group => {
    try {
      returnHtml += `<h5>${locale.headlines.class[lang]} ${group}:</h5><ul>`;
      returnHtml += getRER(group, courses).filter( item => dateIsRecent(item.birthtime, 3)).map( item => helperListitem(item, group)).join('');
      returnHtml += `</ul>`;
    } catch (e) {
      console.log('- ERROR getting lates returned homeworks: '+e);
    }
  });
  return returnHtml;
}

function helperListitem (item, group) {
  if (item.files.length > 0) {
    let filePath = path.join(group, 'courses', item.course, item.lessonId, 'homework', item.studentId);
    let curStudent = getAllUsers(group).filter( user => user.id === Number(item.studentId)).map( user => { return user.fname+' '+user.lname} );
    return `
      <li><a href="/teacher/lessons/${group}/${item.lessonId}" class="orange">${item.course} (${item.lessonId})</a> : <a href="${path.join('/data/classes/', filePath, item.files[0])}" class="orange" target="_blank">${item.files[0]} (${curStudent})</a></li>
    `;
  } else {
    return '';
  }
}

function helperRecentMessages (userId) {
  let returnHtml = '<ul>';
  getLatestMessages(userId).forEach( item => {
    let allMessages = item.messages.filter( item => item.chaterId !== userId);
    let message = allMessages[allMessages.length-1];
    if (message !== undefined) returnHtml += `<li><a href="/communication">${message.chat} (${getUserById(message.chaterId).fname}, ${getUserById(message.chaterId).group})</a></li>`
  });
  returnHtml += '</ul>';
  return returnHtml;
}

function helperWelcome (lang) {
  switch (getDaytime()) {
    case 'AM':
      return locale.teacher.welcome_morning[lang];
    case 'PM':
      return locale.teacher.welcome_afternoon[lang];
    case 'NIGHT':
      return locale.teacher.welcome_evening[lang];
    default:
      return locale.teacher.welcome_afternoon[lang];
  }
}


module.exports = teacherView;
