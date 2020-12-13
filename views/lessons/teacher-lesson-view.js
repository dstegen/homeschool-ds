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
const { workdaysBetween } = require('../../lib/dateJuggler');
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
        <h2 class="d-flex justify-content-between"><span>${myLesson.lesson}: ${myLesson.chapter}</span><span>${group}</span></h2>
        <div class="d-flex justify-content-between">
          <span class="text-muted">${locale.lessons.amount[config.lang]} ${workdaysBetween(myLesson.validFrom, myLesson.validUntil, myLesson.weekdays)} ${locale.lessons.hours[config.lang]} (${moment(myLesson.validFrom).format('LL')} – ${moment(myLesson.validUntil).format('LL')})</span>
          <button type="button" class="btn btn-sm bg-grey ml-3" data-toggle="collapse" data-target="#lesson-form" onclick="javascript: $('#lesson-details').collapse('toggle')">${locale.buttons.edit[config.lang]}</button>
        </div>
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
            ${groupHomework(group, myLesson)}
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


module.exports = teacherLessonView;
