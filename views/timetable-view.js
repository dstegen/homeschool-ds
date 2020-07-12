/*!
 * student/views/timetable-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const { thisWeek, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek } = require('../lib/dateJuggler');
let lessonsConfig = {};


function timetableView (myLessons, myGroup, curWeek=thisWeek()) {
  lessonsConfig = require(path.join('../data/classes/', myGroup,'/config.json'));
  let todayOff = '';
  if (myLessons.filter( item => item.weekdays.includes(weekDayNumber())).length < 1) todayOff = `<span class="text-muted">- kein Unterricht -</span>`;
  return `
  <div class="container mt-3 p-3">
    <h4>Klasse: ${myGroup}</h4>
  </div>
  <div id="week" class="container mb-3 p-3 border collapse show" data-parent="#homeschool-ds">
    <div class="d-flex justify-content-between">
      <div class="d-md-flex">
        <h2>${curWeek}. Woche</h2>
        <span class="ml-md-3 mt-md-2">(${weekDates(curWeek)})</span>
      </div>
      <div class="mt-1">
        <a href="/timetable/${myGroup}/${curWeek-1}" class="btn-sm btn-primary">&nbsp;<<&nbsp;</a>
        <a href="/timetable/${myGroup}/${curWeek+1}" class="btn-sm btn-primary ml-3">&nbsp;>>&nbsp;</a>
      </div>
    </div>
    <hr />
    <div class="row text-center">
      <div class="col-12 col-md-6 col-lg-2 border-right mb-5 mb-lg-0">
        <h5 class="mb-0 ${beforeToday(1, curWeek)?'text-black-50':''}">${weekDay(1)}</h5>
        <small class="text-muted">${formatDate(1, curWeek)}</small>
        ${myLessons.map(lesson => helperLesson(lesson, 1, curWeek)).join('')}
        ${myLessons.filter( item => item.weekdays.includes(1) && isActualWeek(item.validFrom, item.validUntil, curWeek)).length < 1 ?'<p class="text-muted mt-2">- kein Unterricht -</p>':''}
      </div>
      <div class="col-12 col-md-6 col-lg-2 border-right mb-5 mb-lg-0">
        <h5 class="mb-0 ${beforeToday(2, curWeek)?'text-black-50':''}">${weekDay(2)}</h5>
        <small class="text-muted">${formatDate(2, curWeek)}</small>
        ${myLessons.map(lesson => helperLesson(lesson, 2, curWeek)).join('')}
        ${myLessons.filter( item => item.weekdays.includes(2) && isActualWeek(item.validFrom, item.validUntil, curWeek)).length < 1 ?'<p class="text-muted mt-2">- kein Unterricht -</p>':''}
      </div>
      <div class="col-12 col-md-6 col-lg-2 border-right mb-5 mb-lg-0">
        <h5 class="mb-0 ${beforeToday(3, curWeek)?'text-black-50':''}">${weekDay(3)}</h5>
        <small class="text-muted">${formatDate(3, curWeek)}</small>
        ${myLessons.map(lesson => helperLesson(lesson, 3, curWeek)).join('')}
        ${myLessons.filter( item => item.weekdays.includes(3) && isActualWeek(item.validFrom, item.validUntil, curWeek)).length < 1 ?'<p class="text-muted mt-2">- kein Unterricht -</p>':''}
      </div>
      <div class="col-12 col-md-6 col-lg-2 border-right mb-5 mb-lg-0">
        <h5 class="mb-0 ${beforeToday(4, curWeek)?'text-black-50':''}">${weekDay(4)}</h5>
        <small class="text-muted">${formatDate(4, curWeek)}</small>
        ${myLessons.map(lesson => helperLesson(lesson, 4, curWeek)).join('')}
        ${myLessons.filter( item => item.weekdays.includes(4) && isActualWeek(item.validFrom, item.validUntil, curWeek)).length < 1 ?'<p class="text-muted mt-2">- kein Unterricht -</p>':''}
      </div>
      <div class="col-12 col-md-6 col-lg-2 border-right mb-5 mb-lg-0">
        <h5 class="mb-0 ${beforeToday(5, curWeek)?'text-black-50':''}">${weekDay(5)}</h5>
        <small class="text-muted">${formatDate(5, curWeek)}</small>
        ${myLessons.map(lesson => helperLesson(lesson, 5, curWeek)).join('')}
        ${myLessons.filter( item => item.weekdays.includes(5) && isActualWeek(item.validFrom, item.validUntil, curWeek)).length < 1 ?'<p class="text-muted mt-2">- kein Unterricht -</p>':''}
      </div>
      <div class="col-12 col-md-6 col-lg-2 mb-5 mb-lg-0">
        <h5 class="mb-0 ${beforeToday(6, curWeek)?'text-black-50':''}">${weekDay(6)}</h5>
        <small class="text-muted">${formatDate(6, curWeek)}</small>
        ${myLessons.map(lesson => helperLesson(lesson, 6, curWeek)).join('')}
        ${myLessons.filter( item => item.weekdays.includes(6) && isActualWeek(item.validFrom, item.validUntil, curWeek)).length < 1 ?'<p class="text-muted mt-2">- kein Unterricht -</p>':''}
      </div>
      <div class="col-12 mb-5 mb-lg-0 border-top mt-4 pt-3 d-none">
        <h5 class="mb-0 ${beforeToday(7, curWeek)?'text-black-50':''}">${weekDay(7)}</h5>
        <small class="text-muted">${formatDate(7, curWeek)}</small>
        ${myLessons.map(lesson => helperLesson(lesson, 7, curWeek)).join('')}
        ${myLessons.filter( item => item.weekdays.includes(7) && isActualWeek(item.validFrom, item.validUntil, curWeek)).length < 1 ?'<p class="text-muted mt-2">- kein Unterricht -</p>':''}
      </div>
    </div>
  </div>
  `;
}


// Additional functions

function helperLesson (lessonObj, curDay, curWeek) {
  let lessonColor = '';
  if (lessonsConfig.courses.filter( item => item.name === lessonObj.lesson).length > 0) {
    lessonColor = lessonsConfig.courses.filter( item => item.name === lessonObj.lesson)[0].color;
  }
  if (lessonObj.weekdays.includes(curDay) && isActualWeek(lessonObj.validFrom, lessonObj.validUntil, curWeek)) {
    return `
      <div class="card lesson ${lessonColor} mt-2 text-left">
        <div id="lesson-${lessonObj.id}${curDay}" class="card-header px-2 py-1" onclick="$('#lesson-details-${lessonObj.id}${curDay}').collapse('toggle');">
          ${lessonObj.lesson}: ${lessonObj.chapter}
        </div>
        <div id="lesson-details-${lessonObj.id}${curDay}" class="card-body collapse px-2 py-1" data-parent="#week">
          <strong class="card-title">Aufgabe:</strong>
          <p class="card-text">${lessonObj.details}</p>
        </div>
      </div>
    `;
  } else {
    return '';
  }
}


module.exports = timetableView;
