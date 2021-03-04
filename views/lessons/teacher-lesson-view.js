/*!
 * views/lessons/teacher-lesson-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { getAllUsers } = require('../../models/model-user');
const { getLessons } = require('../../models/model-lessons');
const { workdaysBetween, formatDateWithDay } = require('../../lib/dateJuggler');
const filesList = require('../templates/files-list');
const lessonForm = require('./lesson-form');
const lessonUploadForm = require('./lesson-upload-form');


function teacherLessonView (teacher, urlPath) {
  let group = urlPath.split('/')[2];
  let myLessonId = urlPath.split('/')[3];
  const myLesson = getLessons(group).filter( lesson => lesson.id === Number(myLessonId))[0];
  if (teacher.group.includes(group)) {
    return `
      <div id="lesson" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
        <h2 class="d-flex justify-content-between"><span>${getIcon(myLesson.lessonType)} ${myLesson.lesson}: ${myLesson.chapter}</span><span>${group}</span></h2>
        <div class="d-flex justify-content-between">
          <span class="text-muted">${locale.lessons.amount[config.lang]} ${workdaysBetween(myLesson.validFrom, myLesson.validUntil, myLesson.weekdays)} ${locale.lessons.hours[config.lang]} (${moment(myLesson.validFrom).format('LL')} – ${moment(myLesson.validUntil).format('LL')})</span>
          <button type="button" class="btn btn-sm bg-grey ml-3" data-toggle="collapse" data-target="#lesson-form" onclick="javascript: $('#lesson-details').collapse('toggle')">${locale.buttons.edit[config.lang]}</button>
        </div>
          ${myLesson.lessonType === 'onlinelesson' ? '<strong>Termin/e: <br /></strong>' : ''}
          ${myLesson.lessonType === 'onlinelesson' ? myLesson.weekdays.map( item => { return myLesson.time + ' Uhr ' +formatDateWithDay(item, myLesson.startWeek) }).join('<br />') : ''}
        <hr />
        <div id="lesson-form" class="collapse">
          ${lessonForm(myLesson, group, teacher)}
          <hr />
          ${lessonUploadForm(myLesson, group)}
        </div>
        <div id="lesson-details" class="collapse show">
          <div class="row">
            <div class=" col-12 col-md-6 mb-3">
              <span class="lesson-details px-2 py-1">${myLesson.details}</span>
            </div>
            <div class="col-12 col-md-6">
              ${myLesson.files ? filesList(myLesson.files, urlPath, group, '', myLesson.id, '', false) : ''}
            </div>
          </div>
          <div class="mt-5">
            ${myLesson.lessonType !== 'onlinelesson' && myLesson.returnHomework === 'true' ? groupHomework(group, myLesson) : ''}
          </div>
        </div>
      </div>
    `;
  } else {
    return '';
  }
}


// Additional functions

function groupHomework (group, myLesson) {
  let returnHtml = `
    <table class="table">
      <thead>
        <tr>
          <th scope="col">${locale.headlines.th_no[config.lang]}</th>
          <th scope="col">${locale.headlines.th_name[config.lang]}</th>
          <th scope="col">${locale.headlines.th_uploads[config.lang]}</th>
          <th scope="col">${locale.headlines.th_finished[config.lang]}</th>
        </tr>
      </thead>
      <tbody>
  `;
  getAllUsers(group).forEach((user, i) => {
    returnHtml += `
      <tr>
        <th scope="row">${i+1}</th>
        <td>${user.fname} ${user.lname}</td>
        <td>${userUploads(group, myLesson, user.id)}</td>
        <td>${lessonStatus(myLesson, user.id)}</td>
      </tr>
    `;
  });
  returnHtml += '</tbody></table>';
  return returnHtml;
}

function userUploads (group, myLesson, studentId) {
  let uploadsList = [];
  let tmpPath = path.join(__dirname, '../../data/classes', group, 'courses', myLesson.lesson, myLesson.id.toString(), 'homework', studentId.toString());
  if (fs.existsSync(tmpPath)) {
    uploadsList = fs.readdirSync(tmpPath);
  }
  let returnHtml = '';
  uploadsList.forEach( uploadItem => {
    returnHtml += `
      <a href="${path.join('/data/classes', group, 'courses', myLesson.lesson, myLesson.id.toString(), 'homework', studentId.toString(), uploadItem)}" target="_blank">${uploadItem}</a>,
    `;
  });
  return returnHtml;
}

function lessonStatus (myLesson, studentId) {
  if (myLesson.lessonFinished.filter( item => item.finished === true).map( item => { return item.studentId } ).includes(studentId)) {
    return `<span class="checkmark-ok">&#10003;</span>`;
  } else {
    return `<span class="checkmark-missing">X</span>`;
  }
}

function getIcon (lessonType) {
  if (lessonType === 'onlinelesson') {
    return `<button type="button" class="btn btn-sm btn-danger mb-1" data-toggle="collapse" data-target="#lesson-form" onclick="javascript: $('#lesson-details').collapse('toggle')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-camera-video" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175l3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
            </svg>
            </button>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-book mr-1 mb-1" viewBox="0 0 16 16">
              <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
            </svg>`;
  }
}

module.exports = teacherLessonView;
