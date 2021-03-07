/*!
 * views/timetable/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { thisWeek, weekDates, formatDate, weekDay, beforeToday, isActualWeek } = require('../../lib/dateJuggler');
const lessonSmall = require('../lessons/lesson-small');


function timetableView (myLessons, myGroup, curWeek=thisWeek()) {
  return `
  <div class="container mt-3 p-3">
    <h4>${locale.headlines.timetable[config.lang]} ${myGroup}</h4>
  </div>
  <div id="week" class="container mb-3 p-3 border collapse show" data-parent="#homeschool-ds">
    <div class="d-flex justify-content-between">
      <div class="d-md-flex">
        <h2>${locale.headlines.week[config.lang]} ${curWeek}</h2>
        <span class="ml-md-3 mt-md-2">(${weekDates(curWeek)})</span>
      </div>
      <div class="mt-1">
        <a href="/timetable/${myGroup}/${curWeek-1}" class="btn-sm btn-primary">&nbsp;<<&nbsp;</a>
        <a href="/timetable/${myGroup}/${curWeek+1}" class="btn-sm btn-primary ml-3">&nbsp;>>&nbsp;</a>
      </div>
    </div>
    <hr />
    <div class="row text-center">
      ${[1,2,3,4,5,6].map( day => helperWeekday(day, curWeek, myLessons, myGroup)).join('')}
    </div>
  </div>
  `;
}


// Additional functions

function helperWeekday (day, curWeek, myLessons, myGroup) {
  myLessons = myLessons.sort((a,b) => reorderLessonsByDateAsc(a,b));
  return `
    <div class="col-12 col-md-6 col-lg-2 mb-5 mb-lg-0">
      <h5 class="mb-0 ${beforeToday(day, curWeek)?'text-black-50':''}">${weekDay(day)}</h5>
      <small class="text-muted">${formatDate(day, curWeek)}</small>
      ${myLessons.map(lesson => lessonSmall(lesson, day, curWeek, myGroup)).join('')}
      ${myLessons.filter( item => item.weekdays.includes(day) && isActualWeek(item.validFrom, item.validUntil, curWeek)).length < 1 ?'<p class="text-muted mt-2">- '+locale.student.no_lessons[config.lang]+' -</p>':''}
    </div>
  `;
}

function reorderLessonsByDateAsc (lessonA, lessonB) {
  if ((lessonA.time === '' || lessonA.time === undefined) && lessonB.time > '') {
    return 1;
  } else if ((lessonB.time === '' || lessonB.time === undefined) && lessonA.time > '') {
    return -1;
  } else if (lessonA.time > lessonB.time) {
    return 1;
  } else if (lessonA.time < lessonB.time) {
    return -1;
  } else {
    return 0;
  }
}


module.exports = timetableView;
