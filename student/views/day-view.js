/*!
 * student/views/day-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const fs = require('fs');
const { thisWeek, thisDay, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek, momentFromDay } = require('../../lib/dateJuggler');
let lessonsConfig = {};


function studentDayView (myLessons, myGroup, curDay=thisDay(), studentId) {
  lessonsConfig = require(path.join('../../data/classes/', myGroup,'/config.json'));
  let todayOff = '';
  if (myLessons.filter( item => item.weekdays.includes(weekDayNumber())).length < 1) todayOff = `<span class="text-muted">- kein Unterricht -</span>`;
  return `
    <div id="today" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
      <div class="d-flex justify-content-between">
        <h2>${formatDay(curDay)}</h2>
        <div class="mt-1">
          <a href="/student/day/${curDay-1}" class="btn-sm btn-primary">&nbsp;<<&nbsp;</a>
          <a href="/student/day/${curDay+1}" class="btn-sm btn-primary ml-3">&nbsp;>>&nbsp;</a>
        </div>
      </div>
      <hr />
      <div class="row text-center">
        <div class="col-6 border-right">
          ${myLessons.map(lesson => helperLessonBig(lesson, weekDayNumber(curDay), curDay, myGroup, studentId)).join('')}
          ${todayOff}
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function helperLessonBig (lessonObj, curWeekDay, curDay, myGroup, studentId) {
  let lessonColor = '';
  if (lessonsConfig.courses.filter( item => item.name === lessonObj.lesson).length > 0) {
    lessonColor = lessonsConfig.courses.filter( item => item.name === lessonObj.lesson)[0].color;
  }
  let weekNumber = thisWeek(momentFromDay(curDay));
  if (lessonObj.weekdays.includes(curWeekDay) && isActualWeek(lessonObj.validFrom, lessonObj.validUntil, weekNumber)) {
    return `
      <div class="card lessonbig ${lessonColor} mt-2 text-left">
        <div id="lessonbig-${lessonObj.id}${curWeekDay}" class="card-header" onclick="$('#lessonbig-details-${lessonObj.id}${curWeekDay}').collapse('toggle');">
          ${lessonObj.lesson}: ${lessonObj.chapter}
        </div>
        <div id="lessonbig-details-${lessonObj.id}${curWeekDay}" class="card-body collapse" data-parent="#today">
          <strong class="card-title">Aufgabe:</strong>
          <p class="card-text">${lessonObj.details}</p>
          <strong class="card-title">Downloads:</strong>
          <ul class="text-truncate">
            ${getFilesList(path.join(myGroup, 'courses', lessonObj.lesson, lessonObj.id.toString()))}
          </ul>
          <hr />
          <strong class="card-title">Uploads:</strong>
          <ul class="text-truncate">
            ${getFilesList(path.join(myGroup, 'students', studentId.toString(), lessonObj.lesson, lessonObj.id.toString()))}
          </ul>
          <form class="row my-3 p-2 mx-0 align-item-center" action="/fileupload" method="post" enctype="multipart/form-data">
            <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
            <input type="text" readonly class="d-none" id="course" name="course" value="${lessonObj.lesson}">
            <input type="text" readonly class="d-none" id="course" name="courseId" value="${lessonObj.id}">
            <div class="custom-file col-sm-9">
              <input type="file" class="custom-file-input" id="filetoupload-${lessonObj.id}" name="filetoupload">
              <label class="custom-file-label" for="filetoupload-${lessonObj.id}">Datei wählen...</label>
              <div class="invalid-feedback">Ups, da gab es einen Fehler</div>
            </div>
            <div class="col-sm-3">
              <button type="submit" class="btn btn-primary">Upload</button>
            </div>
          </form>
        </div>
      </div>
    `;
  } else {
    return '';
  }
}

function getFilesList (filePath) {
  let returnHtml = '';
  let filesList = [];
  let readPath = path.join(__dirname, '../../data/classes/', filePath);
  if (fs.existsSync(readPath)) {
    try {
      //console.log('+ Reading fileList from: '+readPath);
      filesList = fs.readdirSync(readPath);
      filesList.forEach( item => {
        returnHtml += `<li><a href="${path.join('/data/classes/', filePath, item)}" target="_blank">${item}</a>&nbsp;&nbsp;<a href="#"><strong>[ X ]</strong></a></li>`;
      });
    } catch (e) {
      console.log('- ERROR reading directory: '+e);
    }
  }
  return returnHtml;
}

module.exports = studentDayView;
