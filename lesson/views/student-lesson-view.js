/*!
 * views/lessons/student-lesson-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { formatDay } = require('../../lib/dateJuggler');
const studentLessonBig = require('./student-lesson-big');


function studentLessonView (myLessonsToday, myGroup, curDay, curWeekDay, user, lessonsNotFinishedToday) {
  myLessonsToday = myLessonsToday.sort((a,b) => reorderLessonsByDateAsc(a,b));
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
          ${myLessonsToday.map(lesson => studentLessonBig(lesson, curWeekDay, curDay, myGroup, user.id)).join('')}
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
      ${lessonsNotFinishedToday.map( lessonObj => studentLessonBig(lessonObj, curWeekDay, curDay, myGroup, user.id)).join('')}
    `;
  } else {
    return '';
  }
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


module.exports = studentLessonView;
