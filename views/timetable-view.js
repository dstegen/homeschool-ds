/*!
 * student/views/timetable-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const { thisWeek, weekDates, formatDate, weekDay, beforeToday, isActualWeek } = require('../lib/dateJuggler');
let lessonsConfig = {};


function timetableView (myLessons, myGroup, curWeek=thisWeek()) {
  lessonsConfig = require(path.join('../data/classes/', myGroup,'/config.json'));
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
      ${[1,2,3,4,5,6,7].map( day => helperWeekday(day, curWeek, myLessons)).join('')}
    </div>
  </div>
  `;
}


// Additional functions

function helperWeekday (day, curWeek, myLessons) {
  return `
    <div class="col-12 col-md-6 col-lg-2 mb-5 mb-lg-0">
      <h5 class="mb-0 ${beforeToday(day, curWeek)?'text-black-50':''}">${weekDay(day)}</h5>
      <small class="text-muted">${formatDate(day, curWeek)}</small>
      ${myLessons.map(lesson => helperLesson(lesson, day, curWeek)).join('')}
      ${myLessons.filter( item => item.weekdays.includes(day) && isActualWeek(item.validFrom, item.validUntil, curWeek)).length < 1 ?'<p class="text-muted mt-2">- kein Unterricht -</p>':''}
    </div>
  `;
}

function helperLesson (lessonObj, curDay, curWeek) {
  let lessonColor = '';
  if (lessonsConfig.courses.filter( item => item.name === lessonObj.lesson).length > 0) {
    lessonColor = lessonsConfig.courses.filter( item => item.name === lessonObj.lesson)[0].color;
  }
  if (lessonObj.weekdays.includes(curDay) && isActualWeek(lessonObj.validFrom, lessonObj.validUntil, curWeek)) {
    return `
      <div class="card lesson ${lessonColor} mt-2 text-left">
        <div id="lesson-${lessonObj.id}${curDay}" class="card-header px-2 py-1 text-truncate" onclick="$('#lesson-details-${lessonObj.id}${curDay}').collapse('toggle');">
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
