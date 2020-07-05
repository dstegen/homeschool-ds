/*!
 * teacher/views/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const fs = require('fs');
const { thisWeek, thisDay, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek } = require('../../lib/dateJuggler');
const { initUsers, getPasswdObj, getUserFullName, getUserDetails, getAllUsers, usersOnline } = require('../../models/model-user');


function teacherView (teacher) {
  return `
    <div id="dashboard" class="container collapse show" data-parent="#homeschool-ds">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="border py-2 px-3 mb-3">
          <h4>Guten Tag ${teacher.fname} ${teacher.lname},</h4>
          <p>
            heute is ${weekDay()} und Sie haben <strong>27</strong> neue Nachrichten:
          </p>
          <ul>
            <li>Verstehe Mathe nicht! (Mimi, 3C)</li>
            <li>Hab keine lust zu lesen (Samuel, 3C)</li>
            <li>Wann kann ich mehr Meinecraft spielen? (David, 7A1)</li>
            <li>...</li>
          </ul>
          <br /><br /><br /><br /><br /><br />
        </div>
        <div class="border py-2 px-3 mb-3">
          <h4>Abgegebene Aufgaben:</h4>
          <hr />
          <br /><br /><br /><br /><br /><br />
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="border py-2 px-3 mb-3">
          <h4>Klassen-Chat</h4>
          <hr />
          <br /><br /><br /><br /><br /><br />
        </div>
        <div class="border py-2 px-3 mb-3">
          <h4>Schüler online:</h4>
          <hr />
          ${studentsOnline(teacher.group)}
        </div>
      </div>
    </div>
  </div>
    `;
}


// Additional functions

function studentsOnline (allGroups) {
  let returnHtml = '';
  allGroups.forEach( group => {
    returnHtml += `<h5>Klasse: ${group}:</h5><ul>`;
    usersOnline(group).forEach( user => {
      returnHtml += `<li>${user}</li>`
    });
    returnHtml += `</ul>`;
  });
  return returnHtml;
}


module.exports = teacherView;
