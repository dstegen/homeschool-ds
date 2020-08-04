/*!
 * teacher/views/lessons-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const moment = require('moment');
const { notValid } = require('../../lib/dateJuggler');
const { getAllUsers } = require('../../models/model-user');
const { getLessons } = require('../../models/model-lessons');
const getRER = require('../../lib/getRecentExerciseReturns');


function lessonsView (teacher) {
  return `
    <div id="lessons" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
      <h2>Lessons</h2>
      <hr />
      ${teacher.group.map( group => displayLessons(group, teacher.courses)).join('')}
    </div>
  `;
}


// Additional functions

function displayLessons (group, courses) {
  return `
    <div class="mb-5">
      <div class="d-flex justify-content-between">
        <h4>Class ${group}</h4>
        <span>
          <a href="#" onclick="$('.details-box-${group}').toggle();">Archived lessons</a>
           |
          <a href="/timetable/${group}">Timetable</a>
        </span>
      </div>
      ${getLessons(group).map( item => helperLesson(item, group, courses)).join('')}
      <div class="d-flex justify-content-end p-2 mb-">
        <a href="/edit/${group}" class="btn-sm btn-primary" data-toggle="tooltip" data-placement="left" title="Add lesson"> + </a>
      </div>
    </div>
  `;
}

function helperLesson (item, group, courses) {
  if (courses.includes(item.lesson) || courses[0] === 'all') {
    return `
      <div class="border p-2 mb-2 ${notValid(item.validUntil) ? 'details-box-'+group+'" style="display: none;"' : ''}">
        <div class="d-flex justify-content-between">
          <div><strong>${item.lesson}</strong>: ${item.chapter} <span class="text-muted">(${moment(item.validFrom).format('LL')} – ${moment(item.validUntil).format('LL')})</span></div>
          <div class="d-flex justify-content-end">
            <a href="/edit/${group}/${item.id}" class="btn btn-sm bg-grey ml-3 ${notValid(item.validUntil) ? 'd-none' : ''}">Edit</a>
            <a data-toggle="collapse" href="#lesson-homework-${group}-${item.id}" class="btn btn-sm btn-primary ml-3">Homework</a>
            <a href="/teacher/lessons/${group}/${item.id}" class="btn btn-sm btn-secondary ml-3">Details</a>
          </div>
        </div>
        <div class="collapse" id="lesson-homework-${group}-${item.id}" data-parent="#lessons">
          <hr />
          <strong>Abgegeben Aufgaben:</strong>
          <ul>
            ${getRER(group, [item.lesson]).filter( file => Number(file.lessonId) === Number(item.id) ).map( lesson => helperListitem(lesson, group)).join('')}
          </ul>
        </div>
      </div>
    `;
  } else {
    return '';
  }
}

function helperListitem (item, group) {
  if (item.files.length > 0) {
    let filePath = path.join(group, 'courses', item.course, item.lessonId, 'homework', item.studentId);
    let curStudent = getAllUsers(group).filter( user => user.id === Number(item.studentId)).map( user => { return user.fname+' '+user.lname} );
    return `
      <li><div class="d-flex justify-content-between text-truncate"><a href="${path.join('/data/classes/', filePath, item.files[0])}" target="_blank">${curStudent}: ${item.files[0]}</a></li>
    `;
  } else {
    return '';
  }
}


module.exports = lessonsView;
