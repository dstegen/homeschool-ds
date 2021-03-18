/*!
 * lesson/views/all-lessons-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const { getConfig } = require('../../main/models/model-config');
const { getGroupConfig } = require('../../main/models/model-group');
const config = getConfig();
const { notValid } = require('../../lib/dateJuggler');
const { getAllUsers } = require('../../user/models/model-user');
const { getLessons, returnedHomework } = require('../../lesson/models/model-lessons');
const formSelectColumn = require('../../views/templates/form-select2');
const getIcon = require('../../main/views/get-icon');
const lessonDateandtime = require('./lesson-dateandtime');


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
      ${user.group.map( group => displayLessons(group, user)).join('')}
    </div>
  `;
}


// Additional functions

function displayLessons (group, user) {
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
      ${getLessons(group).map( item => helperLesson(item, group, user)).join('')}
      <div class="d-flex justify-content-end p-2 mb-">
        <a href="/lessons/add/${group}" class="btn-sm btn-primary" data-toggle="tooltip" data-placement="left" title="${locale.buttons.add_lesson[config.lang]}"> + </a>
      </div>
    </div>
  `;
}

function helperLesson (item, group, user) {
  if (user.courses.includes(item.lesson) || user.leader.includes(group)) {
    let homeworkButton = '';
    if (item.returnHomework === true) homeworkButton = `<a data-toggle="collapse" href="#lesson-homework-${group}-${item.id}" class="btn btn-sm btn-primary ml-3">${locale.buttons.homework[config.lang]}</a>`;
    return `
      <div class="border p-2 mb-2 lesson-box ${'details-box-'+item.lesson} ${notValid(item.validUntil) ? 'details-box details-box-'+group+'" style="display: none;"' : ''}">
        <div class="d-flex justify-content-between">
          <div>${getIcon(item.lessonType, 'red')}<strong>${item.lesson}</strong>: ${item.chapter} <span class="text-muted"> - ${lessonDateandtime(item)}</span></div>
          <div class="d-flex justify-content-end">
            ${homeworkButton}
            <a href="/lessons/show/${group}/${item.id}" class="btn btn-sm btn-secondary ml-3">${locale.buttons.details[config.lang]}</a>
          </div>
        </div>
        <div class="collapse" id="lesson-homework-${group}-${item.id}" data-parent="#lessons">
          <hr />
          <strong>${locale.headlines.returned_homework[config.lang]}:</strong>
          <ul>
            ${returnedHomework(group, [item.lesson], user).filter( file => Number(file.lessonId) === Number(item.id) ).map( lesson => helperListitem(lesson, group)).join('')}
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
