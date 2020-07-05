/*!
 * student/views/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const { thisWeek, thisDay, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek } = require('../../lib/dateJuggler');
let lessonsConfig = {};


function studentView (myLessons, myGroup, curWeek=thisWeek(), user={}) {
  lessonsConfig = require(path.join('../../data/classes/', myGroup,'/config.json'));
  let todayOff = '';
  if (myLessons.filter( item => item.weekdays.includes(weekDayNumber())).length < 1) todayOff = `<span class="text-muted">- kein Unterricht -</span>`;
  return `
    <div id="dashboard" class="container collapse show" data-parent="#homeschool-ds">
      <h2 class="container d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h4>Hallo ${user.fname},</h4>
            <p>
              heute is ${weekDay()} und du hast <strong>${helperLessonsCount(myLessons, weekDayNumber(), curWeek)} Stunden</strong>:
            </p>
            <ul>
              ${myLessons.map(lesson => helperLessonsToday(lesson, weekDayNumber(), curWeek)).join('')}
            </ul>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h4>Klassen-Chat</h4>
            <hr />
            <br /><br /><br /><br /><br /><br />
          </div>
          <div class="border py-2 px-3 mb-3">
            <h4>Persönlicher Chat</h4>
            <hr />
            <br /><br /><br /><br /><br /><br />
          </div>
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function helperLessonsCount (myLessons, curWeekDay, curWeek) {
  let count = 0;
  myLessons.forEach( lessonObj => {
    if (lessonObj.weekdays.includes(curWeekDay) && isActualWeek(lessonObj.validFrom, lessonObj.validUntil, curWeek)) {
      count += 1;
    }
  });
  return count;
}

function helperLessonsToday (lessonObj, curWeekDay, curWeek) {
  let returnHtml = '';
  if (lessonObj.weekdays.includes(curWeekDay) && isActualWeek(lessonObj.validFrom, lessonObj.validUntil, curWeek)) {
    returnHtml = `<li>${lessonObj.lesson}: ${lessonObj.chapter}</li>`;
  }
  return returnHtml;
}

module.exports = studentView;
