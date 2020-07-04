/*!
 * student/views/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const { thisWeek, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek } = require('../../lib/dateJuggler');
let lessonsConfig = {};


function studentView (myLessons, myGroup, curWeek=thisWeek()) {
  lessonsConfig = require(path.join('../../data/classes/', myGroup,'/config.json'));
  let todayOff = '';
  if (myLessons.filter( item => item.weekdays.includes(weekDayNumber())).length < 1) todayOff = `<span class="text-muted">- kein Unterricht -</span>`;
  return `
    <div id="dashboard" class="container collapse show" data-parent="#homeschool-ds">
      <h2 class="container d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
    </div>
  `;
}


// Additional functions



module.exports = studentView;
