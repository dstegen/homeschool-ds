/*!
 * teacher/views/single-lesson-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const { initUsers, getPasswdObj, getUserFullName, getUserDetails, getAllUsers } = require('../../models/model-user');
const { getLessons } = require('../../models/model-lessons');
const { workdaysBetween } = require('../../lib/dateJuggler');
const getFilesList = require('../../lib/getFilesList');
const getRER = require('../../lib/getRecentExerciseReturns');


function teacherLessonsView (teacher, urlPath) {
  let group = urlPath.split('/')[2];
  let myLessonId = urlPath.split('/')[3];
  const item = getLessons(group).filter( lesson => lesson.id === Number(myLessonId))[0];
  if (teacher.group.includes(group)) {
    return `
      <div id="lesson" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
        <h2 class="d-flex justify-content-between"><span>${item.lesson}: ${item.chapter}</span><span>${group}</span></h2>
        <div class="d-flex justify-content-between">
          <span class="text-muted">Umfang: ${workdaysBetween(item.validFrom, item.validUntil, item.weekdays)} Stunden (${item.validFrom} – ${item.validUntil})</span>
          <a href="/edit/${group}/${item.id}" class="btn btn-sm bg-grey ml-3">Edit</a>
        </div>
        <hr />
        <div class="mb-3">
          <span class="details-box px-2 py-1">${item.details}</span>
        </div>

        <span>Downloads:</span>
        <ul>
          ${getFilesList(path.join(group, 'courses', item.lesson, myLessonId, 'material')).map(lesson  => helperDownloads(path.join(group, 'courses', item.lesson, myLessonId, 'material'), lesson)).join('')}
        </ul>
        <hr />
        <strong>Abgegeben Aufgaben:</strong>
        <ul>
          ${getRER(group, [item.lesson]).filter( file => Number(file.lessonId) === Number(item.id) ).map( lesson => helperListitem(lesson, group)).join('')}
        </ul>
      </div>
    `;
  } else {
    return '';
  }
}


// Additional functions

function helperListitem (item, group) {
  if (item.files.length > 0) {
    let filePath = path.join(group, 'courses', item.course, item.lessonId, 'homework', item.studentId);
    let curStudent = getAllUsers(group).filter( user => user.id === Number(item.studentId)).map( user => { return user.fname+' '+user.lname} );
    return `
      <li><div class="d-flex justify-content-between text-truncate"><a href="${path.join('/data/classes/', filePath, item.files[0])}" target="_blank">${curStudent}: ${item.files[0]}</a><span class="checkmark-ok">&#10003;</span> </li>
    `;
  } else {
    return '';
  }
}

function helperDownloads (filePath, item) {
  return `
    <li><div class="d-flex justify-content-between text-truncate"><a href="${path.join('/data/classes/', filePath, item)}" target="_blank">${item}</a></li>
  `;
}


module.exports = teacherLessonsView;
