/*!
 * views/lin/get-onlinelessons.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { thisWeek, isActualWeek, weekDayFromNumber } = require('../../lib/dateJuggler');
const { getLessons } = require('../../models/model-lessons');

function getOnlinelessons (user, weekOffset) {
  let returnHtml = '';
  let allLessons = [];
  if (user.role === 'teacher') {
    user.group.forEach( group => {
      allLessons = allLessons.concat(getLessons(group).filter(item => item.lessonType === 'onlinelesson' && isActualWeek(item.validFrom, item.validUntil, thisWeek()+weekOffset) && (user.courses.includes(item.lesson) || user.courses[0] === 'all')));
    });
  } else {
    allLessons = getLessons(user.group).filter(item => item.lessonType === 'onlinelesson' && isActualWeek(item.validFrom, item.validUntil, thisWeek()+weekOffset));
  }
  // sort lessons according to date & time
  allLessons = allLessons.sort((a,b) => reorderLessonsByDateAsc(a,b));
  [1,2,3,4,5,6].forEach( wd => {
    if (allLessons.filter(item => item.weekdays.includes(wd)).length > 0) {
      returnHtml += '<strong>' + weekDayFromNumber(thisWeek()+weekOffset, wd) + '</strong><br />'
      allLessons.filter(item => item.weekdays.includes(wd)).forEach( item => {
        returnHtml += '<div class="mb-2">'
        returnHtml += '<strong>' + item.time + ' ' + locale.lessons.oclock[config.lang] + '</strong>: ';
        returnHtml += item.lesson + ': ' + item.chapter + '<br />'
        returnHtml += '</div>'
      });
    }
  });
  return returnHtml;
}


// Additional functions

function reorderLessonsByDateAsc (lessonA, lessonB) {
  if (lessonA.weekdays[0] > lessonB.weekdays[0]) {
    return 1;
  } else if (lessonA.weekdays[0] < lessonB.weekdays[0]) {
    return -1;
  } else {
    if (lessonA.time > lessonB.time) {
      return 1;
    } else if (lessonA.time < lessonB.time) {
      return -1;
    } else {
      return 0;
    }
  }
}


module.exports = getOnlinelessons;
