/*!
 * views/lessons/student-lesson-not-finished.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { thisDay, formatDay, momentFromDay } = require('../../lib/dateJuggler');
const { lessonsNotFinished } = require('../../models/model-lessons');
const simpleList = require('../templates/simple-list');


function studentLessonsNotFinished (user) {
  let lessonsNotFinishedToday = lessonsNotFinished(user, momentFromDay(thisDay()));
  if (lessonsNotFinishedToday.length > 0) {
    let headline = `<span class="text-danger">${locale.student.you_have[config.lang]} <strong>${lessonsNotFinishedToday.length}</strong> ${locale.student.lessons_not_finished[config.lang]}:</span>`;
    return simpleList(headline, lessonsNotFinishedToday.map(lessonObj => { return `<a href="/lessons/day">${lessonObj.lesson}: ${lessonObj.chapter} (${locale.student.return_date[config.lang]}: ${formatDay(thisDay(lessonObj.validUntil))})</a>`;}));
  } else {
    return '';
  }
}


module.exports = studentLessonsNotFinished;
