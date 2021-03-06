/*!
 * views/lessons/student-lesson-dayview.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { formatDay } = require('../../lib/dateJuggler');
const orderLessonByTime = require('../../lib/order-lesson-bytime');
const lessonBig = require('./lesson-big');


function studentLessonDayview (myLessonsToday, myGroup, curDay, curWeekDay, user, lessonsNotFinishedToday) {
  myLessonsToday = myLessonsToday.sort((a,b) => orderLessonByTime(a,b));
  return `
    <div id="today" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
      <div class="d-flex justify-content-between">
        <h2>${formatDay(curDay)}</h2>
        <div class="mt-1">
          <a href="/lessons/day/${curDay-1}" class="btn-sm btn-primary">&nbsp;<<&nbsp;</a>
          <a href="/lessons/day/${curDay+1}" class="btn-sm btn-primary ml-3">&nbsp;>>&nbsp;</a>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-12 col-md-6 border-right">
          ${myLessonsToday.map(lesson => lessonBig(lesson, curWeekDay, curDay, myGroup, user.id)).join('')}
          ${myLessonsToday.length === 0 ? '<div class="text-muted w-100 text-center mt-4">- '+locale.student.no_lessons[config.lang]+' -</div>' : ''}
        </div>
        <div class="col-12 col-md-6">
          ${helperLessonsNotFinished(lessonsNotFinishedToday, curWeekDay, curDay, myGroup, user)}
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function helperLessonsNotFinished (lessonsNotFinishedToday, curWeekDay, curDay, myGroup, user) {
  if (lessonsNotFinishedToday.length > 0) {
    return `
      <h6 class="text-center text-danger my-4">${locale.student.not_finished_lessons[config.lang]}:</h6>
      ${lessonsNotFinishedToday.map( lessonObj => lessonBig(lessonObj, curWeekDay, curDay, myGroup, user.id)).join('')}
    `;
  } else {
    return '';
  }
}


module.exports = studentLessonDayview;
