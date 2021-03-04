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
    let homeworkButton = '';
    if (item.lessonType !== 'onlinelesson') homeworkButton = `<a data-toggle="collapse" href="#lesson-homework-${group}-${item.id}" class="btn btn-sm btn-primary ml-3">${locale.buttons.homework[config.lang]}</a>`;
    return `
      <div class="border p-2 mb-2 lesson-box ${'details-box-'+item.lesson} ${notValid(item.validUntil) ? 'details-box details-box-'+group+'" style="display: none;"' : ''}">
        <div class="d-flex justify-content-between">
          <div>${getIcon(item.lessonType)}<strong>${item.lesson}</strong>: ${item.chapter} <span class="text-muted">(${moment(item.validFrom).format('LL')} – ${moment(item.validUntil).format('LL')})</span></div>
          <div class="d-flex justify-content-end">
            ${homeworkButton}
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

function getIcon (lessonType) {
  if (lessonType === 'onlinelesson') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-camera-video mr-1 mb-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175l3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
            </svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book mr-1 mb-1" viewBox="0 0 16 16">
              <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
            </svg>`;
  }
}


module.exports = allLessonsView;
