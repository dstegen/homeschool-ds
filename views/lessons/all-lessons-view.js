/*!
 * views/lessons/all-lessons-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const moment = require('moment');
const locale = require('../../lib/locale');
const { getConfig, getGroupConfig } = require('../../models/model-config');
const config = getConfig();
const { notValid } = require('../../lib/dateJuggler');
const { getAllUsers } = require('../../models/model-user');
const { getLessons, returnedHomework } = require('../../models/model-lessons');
const formSelectColumn = require('../templates/form-select-column');


function allLessonsView (user) {
  let allLessonsList = ['Filter...'];
  for (let i=0; i<user.group.length; i++) {
    getGroupConfig(user.group[i]).courses.forEach( item => {
      allLessonsList.push(item.name);
    });
  }
  return `
    <div id="lessons" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
      <div class="d-flex justify-content-between">
        <h2>${locale.headlines.navi_lessons[config.lang]}</h2>
        <div class="form-group row mb-1">
          ${formSelectColumn([... new Set(allLessonsList)], '', '', 'onchange="filterLessons(this.value)"')}
        </div>
      </div>
      <hr />
      ${user.group.map( group => displayLessons(group, user.courses)).join('')}
    </div>
  `;
}


// Additional functions

function displayLessons (group, courses) {
  return `
    <div class="mb-5">
      <div class="d-flex justify-content-between">
        <h4>${locale.headlines.class[config.lang]} ${group}</h4>
        <span>
          <a href="#" onclick="$('.details-box-${group}').toggle();">${locale.headlines.archived_lessons[config.lang]}</a>
           |
          <a href="/timetable/${group}">${locale.headlines.timetable[config.lang]}</a>
        </span>
      </div>
      ${getLessons(group).map( item => helperLesson(item, group, courses)).join('')}
      <div class="d-flex justify-content-end p-2 mb-">
        <a href="/lessons/add/${group}" class="btn-sm btn-primary" data-toggle="tooltip" data-placement="left" title="${locale.buttons.add_lesson[config.lang]}"> + </a>
      </div>
    </div>
  `;
}

function helperLesson (item, group, courses) {
  if (courses.includes(item.lesson) || courses[0] === 'all') {
    return `
      <div class="border p-2 mb-2 lesson-box ${'details-box-'+item.lesson} ${notValid(item.validUntil) ? 'details-box details-box-'+group+'" style="display: none;"' : ''}">
        <div class="d-flex justify-content-between">
          <div><strong>${item.lesson}</strong>: ${item.chapter} <span class="text-muted">(${moment(item.validFrom).format('LL')} – ${moment(item.validUntil).format('LL')})</span></div>
          <div class="d-flex justify-content-end">
            <a data-toggle="collapse" href="#lesson-homework-${group}-${item.id}" class="btn btn-sm btn-primary ml-3">${locale.buttons.homework[config.lang]}</a>
            <a href="/lessons/show/${group}/${item.id}" class="btn btn-sm btn-secondary ml-3">${locale.buttons.details[config.lang]}</a>
          </div>
        </div>
        <div class="collapse" id="lesson-homework-${group}-${item.id}" data-parent="#lessons">
          <hr />
          <strong>${locale.headlines.returned_homework[config.lang]}:</strong>
          <ul>
            ${returnedHomework(group, [item.lesson]).filter( file => Number(file.lessonId) === Number(item.id) ).map( lesson => helperListitem(lesson, group)).join('')}
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
    let curStudent = getAllUsers(group).filter( user => user.id === Number(item.studentId)).map( user => { return user.fname+' '+user.lname} );
    return `
      <li><div class="d-flex justify-content-between text-truncate"><a href="${item.files[0]}" target="_blank">${curStudent}: ${item.files[0].split('/').pop()}</a></li>
    `;
  } else {
    return '';
  }
}


module.exports = allLessonsView;
