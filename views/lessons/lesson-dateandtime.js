/*!
 * views/lessons/lesson-dateandtime.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { workdaysBetween, validFromUntil } = require('../../lib/dateJuggler');


function lessonDateandtime (myLesson) {
  let returnHtml = '';
  returnHtml = workdaysBetween(myLesson.validFrom, myLesson.validUntil, myLesson.weekdays);
  returnHtml += ' ' + locale.lessons.hours[config.lang];
  returnHtml += ' (' + validFromUntil(myLesson.validFrom, myLesson.validUntil, myLesson.weekdays);
  if (myLesson.lessonType === 'onlinelesson') returnHtml += ', ' + myLesson.time;
  returnHtml += ')';
  return returnHtml;
}


module.exports = lessonDateandtime;
