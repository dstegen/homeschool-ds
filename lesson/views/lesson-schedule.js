/*!
 * lesson/views/lesson-schedule.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { formatDateWithDay } = require('../../lib/dateJuggler');


function lessonSchedule (myLesson) {
  let returnHtml = '';
  returnHtml += '<strong>'+locale.headlines.schedule[config.lang]+': <br /></strong>'
  for (let i=1; i<=myLesson.weekAmount; i++) {
    let week = (i-1)+Number(myLesson.startWeek);
    myLesson.weekdays.forEach( day => {
      returnHtml += myLesson.time + ' ' + locale.lessons.oclock[config.lang] + ' ' + formatDateWithDay(day, week) + '<br />';
    });
  }
  return returnHtml;
}


module.exports = lessonSchedule;
