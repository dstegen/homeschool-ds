/*!
 * teacher/views/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const { initUsers, getPasswdObj, getUserFullName, getUserDetails, getAllUsers } = require('../../models/model-user');


function teacherView (teacher) {
  return `
    <div id="dashboard" class="container collapse show" data-parent="#homeschool-ds">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
    </div>
    <div id="class" class="container my-3 p-3 border collapse" data-parent="#homeschool-ds">
      <h2>Klasse/n von ${teacher.fname} ${teacher.lname}</h2>
      <hr />
      ${teacher.group.map(displayClass).join('')}
    </div>
    <div id="lessons" class="container my-3 p-3 border collapse" data-parent="#homeschool-ds">
      <h2>Stunden</h2>
      <hr />
      ${teacher.group.map(displayLessons).join('')}
    </div>
  `;
}


// Additional functions

function displayClass (group) {
  let returnHtml = `<h4 class="pt-3 pb-1 px-1">Klasse: ${group}</h4>`;
  returnHtml += '<table class="table border"><tr><th>Nr.</th><th>Vorname</th><th>Nachname</th><th>Telefon</th></tr>';
  getAllUsers(group).filter( person => person.role === 'student').forEach((item, i) => {
    returnHtml += `
      <tr>
        <td>${i+1}</td>
        <td>${item.fname}</td>
        <td>${item.lname}</td>
        <td>${item.phone}</td>
        <td class="d-flex justify-content-end">
          <button class="btn-sm btn-primary">Edit</button>
          <button class="btn-sm btn-secondary ml-2" onclick="sendEmail('${item.email}');">E-Mail</button>
          <button class="btn-sm btn-success ml-2" onclick="alert('Hallo ${item.email}');">Nachricht</button>
        </td>
      </tr>`
  });
  returnHtml += `<tr><td class="text-right" colspan="5"><button class="btn-sm btn-primary" data-toggle="tooltip" data-placement="left" title="Add student"> + </button></td></tr>`;
  returnHtml += '</table>'
  return returnHtml;
}

function displayLessons (group) {
  let returnHtml = `<div class="mb-5"><h4>Klasse ${group}</h4>`;
  const lessons = require(path.join('../../data/classes', group , 'lessons.json')).lessons;
  lessons.forEach((item, i) => {
    returnHtml += `
      <div class="border p-2 mb-2 d-flex justify-content-between">
        <div><strong>${item.lesson}</strong>: ${item.chapter}</div>
        <button class="btn-sm btn-primary">Edit</button>
      </div>
    `;
  });
  returnHtml += `
      <div class="d-flex justify-content-end p-2 mb-">
        <button class="btn-sm btn-primary" data-toggle="tooltip" data-placement="left" title="Add lesson"> + </button>
      </div>
  `;
  returnHtml += `</div>`;
  return returnHtml;
}

module.exports = teacherView;
