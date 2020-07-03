/*!
 * teacher/views/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const { initUsers, getPasswdObj, getUserFullName, getUserDetails, getAllUsers } = require('../../models/model-user');


function teacherView (teacher) {
  return `
    <div id="dashboard" class="container my-3 p-3 border collapse" data-parent="#homeschool-ds">
      <h2>Dashboard</h2>
      <hr />
    </div>
    <div id="class" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
      <h2>Klasse/n</h2>
      <hr />
      ${teacher.group.map(displayClass).join('')}
    </div>
    <div id="lessons" class="container my-3 p-3 border collapse" data-parent="#homeschool-ds">
      <h2>Stunden</h2>
      <hr />
    </div>
  `;
}

// Additional functions

function displayClass (group) {
  let returnHtml = `<h4 class="pt-3 pb-1 px-1">Klasse: ${group}</h4>`;
  returnHtml += '<table class="table border"><tr><th>Nr.</th><th>Vorname</th><th>Nachname</th></tr>';
  getAllUsers(group).filter( person => person.role === 'student').forEach((item, i) => {
    returnHtml += `
      <tr>
        <td>${i}</td>
        <td>${item.fname}</td>
        <td>${item.lname}</td>
        <td><button class="btn-sm btn-secondary">Edit</button></td>
        <td><button class="btn-sm btn-primary" onclick="sendEmail(${item.email});">E-Mail</button></td>
      </tr>`
  });
  returnHtml += '</table>'
  return returnHtml;
}

module.exports = teacherView;
