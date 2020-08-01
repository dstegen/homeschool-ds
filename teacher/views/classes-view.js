/*!
 * teacher/views/classes-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const { thisWeek } = require('../../lib/dateJuggler');
const { initUsers, getPasswdObj, getUserFullName, getUserDetails, getAllUsers } = require('../../models/model-user');
const classChat = require('../../views/templates/chat');

function teacherClassesView (teacher) {
  return `
    <div id="class" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
      <h2>Klasse/n von ${teacher.fname} ${teacher.lname}</h2>
      <hr />
      ${teacher.group.map( group => displayClass(group, teacher) ).join('')}
    </div>
  `;
}


// Additional functions

function displayClass (group, teacher) {
  let returnHtml = `<div class="mb-5">
    <div class="d-flex justify-content-between">
      <h4>Klasse ${group}</h4>
      <span>
      <a href="#" onclick="$('#class-${group}-chat').collapse('toggle')" class="d-none d-md-inline">Klassen-Chat</a>
      <a href="/timetable/${group}" class="ml-2">Timetable</a>
      </span>
    </div>
    <div class="row">
      <div class="col-12 col-lg collapse show">
        <table class="table border">
          <tr>
            <th>Nr.</th>
            <th>Vorname</th>
            <th>Nachname</th>
          </tr>
    `;
  getAllUsers(group).filter( person => person.role === 'student').forEach((item, i) => {
    returnHtml += `
          <tr>
            <td>${i+1}</td>
            <td>${item.fname}</td>
            <td>${item.lname}</td>
            <td class="d-flex justify-content-end">
              <button class="d-none btn btn-sm btn-secondary ml-2" onclick="sendEmail('${item.email}');">E-Mail</button>
              <button class="btn btn-sm btn-success ml-2" onclick="alert('Hallo ${item.email}');">Nachricht</button>
            </td>
          </tr>`
  });
  returnHtml += `
        </table>
      </div>
      <div id="class-${group}-chat" class="col-12 col-lg collapse">
        ${classChat(group, teacher, 800)}
      </div>
    </div>
    <hr />
        `;
  return returnHtml;
}


module.exports = teacherClassesView;
