/*!
 * teacher/views/lessons-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const { thisWeek } = require('../../lib/dateJuggler');
const { initUsers, getPasswdObj, getUserFullName, getUserDetails, getAllUsers } = require('../../models/model-user');


function teacherLessonsView (teacher) {
  return `
    <div id="lessons" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
      <h2>Stunden</h2>
      <hr />
      ${teacher.group.map( group => displayLessons(group, teacher.courses)).join('')}
    </div>
  `;
}


// Additional functions

function displayLessons (group, courses) {
  let returnHtml = `<div class="mb-5"><h4>Klasse ${group}</h4>`;
  const lessons = require(path.join('../../data/classes', group , 'lessons.json')).lessons;
  lessons.forEach( item => {
    if (courses.includes(item.lesson) || courses[0] === 'all') {
      returnHtml += `
        <div class="border p-2 mb-2 d-flex justify-content-between">
          <div><strong>${item.lesson}</strong>: ${item.chapter} <span class="text-muted">(${item.validFrom} – ${item.validUntil})</span></div>
          <div class="d-flex justify-content-end">
            <form action="/delete" method="post">
              <input type="text" name="id" class="d-none" hidden value="${item.id}" />
              <input type="text" name="group" class="d-none" hidden value="${group}" />
              <button type="submit" class="btn-sm btn-danger" onclick="confirmDelete(this.form.name, \'delete\')">Delete</button>
            </form>
            <a href="/edit/${group}/${item.id}" class="btn-sm btn-primary ml-3">Edit</a>
          </div>
        </div>
      `;
    }
  });
  returnHtml += `
      <div class="d-flex justify-content-end p-2 mb-">
        <a href="/edit/${group}" class="btn-sm btn-primary" data-toggle="tooltip" data-placement="left" title="Add lesson"> + </a>
      </div>
  `;
  returnHtml += `</div>`;
  return returnHtml;
}


module.exports = teacherLessonsView;
