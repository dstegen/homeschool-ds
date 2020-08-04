/*!
 * teacher/views/single-lesson-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const fs = require('fs');
const moment = require('moment');
const { getAllUsers } = require('../../models/model-user');
const { getLessons } = require('../../models/model-lessons');
const { workdaysBetween } = require('../../lib/dateJuggler');
const getFilesList = require('../../lib/getFilesList');


function singleLessonView (teacher, urlPath) {
  let group = urlPath.split('/')[2];
  let myLessonId = urlPath.split('/')[3];
  const myLesson = getLessons(group).filter( lesson => lesson.id === Number(myLessonId))[0];
  if (teacher.group.includes(group)) {
    return `
      <div id="lesson" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
        <h2 class="d-flex justify-content-between"><span>${myLesson.lesson}: ${myLesson.chapter}</span><span>${group}</span></h2>
        <div class="d-flex justify-content-between">
          <span class="text-muted">Amount ${workdaysBetween(myLesson.validFrom, myLesson.validUntil, myLesson.weekdays)} hours (${moment(myLesson.validFrom).format('LL')} – ${moment(myLesson.validUntil).format('LL')})</span>
          <a href="/edit/${group}/${myLesson.id}" class="btn btn-sm bg-grey ml-3">Edit</a>
        </div>
        <hr />
        <div class="mb-3">
          <span class="details-box px-2 py-1">${myLesson.details}</span>
        </div>
        <ul>
          ${getFilesList(path.join(group, 'courses', myLesson.lesson, myLessonId, 'material')).map(lesson  => helperDownloads(path.join(group, 'courses', myLesson.lesson, myLessonId, 'material'), lesson)).join('')}
        </ul>
        <div class="mt-5">
          ${groupHomework(group, myLesson)}
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
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Uploads</th>
          <th scope="col">finished</th>
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
  if (myLesson.lessonFinished.includes(studentId)) {
    return `<span class="checkmark-ok">&#10003;</span>`;
  } else {
    return `<span class="checkmark-missing">X</span>`;
  }
}

function helperDownloads (filePath, item) {
  return `
    <li><div class="d-flex justify-content-between text-truncate"><a href="${path.join('/data/classes/', filePath, item)}" target="_blank">${item}</a></li>
  `;
}


module.exports = singleLessonView;
