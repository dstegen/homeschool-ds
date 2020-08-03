/*!
 * student/views/day-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const path = require('path');
const { thisWeek, thisDay, weekDayNumber, formatDay, momentFromDay, workdaysBetween, notValid } = require('../../lib/dateJuggler');
const { lessonsToday, lessonsNotFinished } = require('../../models/model-lessons');
const getFilesList = require('../../lib/getFilesList');
let lessonsConfig = {};


function studentDayView (myLessons, myGroup, curDay=thisDay(), user) {
  lessonsConfig = require(path.join('../../data/classes/', myGroup,'/config.json'));
  let myLessonsToday = lessonsToday(myGroup, weekDayNumber(curDay), thisWeek(momentFromDay(curDay)));
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
      <div class="row">
        <div class="col-12 col-md-6 border-right">
          ${myLessonsToday.map(lesson => helperLessonBig(lesson, weekDayNumber(curDay), curDay, myGroup, user.id)).join('')}
          ${myLessonsToday.length === 0 ? '<div class="text-muted w-100 text-center mt-4">- kein Unterricht -</div>' : ''}
        </div>
        <div class="col-12 col-md-6">
          ${helperLessonsNotFinished(weekDayNumber(curDay), curDay, myGroup, user)}
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function helperLessonsNotFinished (curWeekDay, curDay, myGroup, user) {
  let returnHtml = '';
  let lessonsNotFinishedToday = lessonsNotFinished(user, momentFromDay(curDay));
  if (lessonsNotFinishedToday.length > 0) {
    returnHtml += '<h6 class="text-center text-danger my-4">Noch nicht abgeschlossene Stunden:</h6>'
    returnHtml += lessonsNotFinishedToday.map( lessonObj => helperLessonBig(lessonObj, curWeekDay, curDay, myGroup, user.id)).join('');
  }
  return returnHtml;
}

function helperLessonBig (lessonObj, curWeekDay, curDay, myGroup, studentId) {
  let lessonColor = '';
  if (lessonsConfig.courses.filter( item => item.name === lessonObj.lesson).length > 0) {
    lessonColor = lessonsConfig.courses.filter( item => item.name === lessonObj.lesson)[0].color;
  }
  return `
    <div class="card lessonbig ${lessonColor} mt-2 text-left">
      <div id="lessonbig-${lessonObj.id}${curWeekDay}" class="card-header d-flex justify-content-between" onclick="$('#lessonbig-details-${lessonObj.id}${curWeekDay}').collapse('toggle');">
        <span>${lessonObj.lesson}: ${lessonObj.chapter}</span>
        ${lessonIndicator(myGroup, lessonObj, studentId, curDay)}
      </div>
      <div id="lessonbig-details-${lessonObj.id}${curWeekDay}" class="card-body collapse" data-parent="#today">
        <strong class="card-title">Aufgabe:</strong>
        <p class="card-text">${lessonObj.details}</p>
        <strong class="card-title">Downloads:</strong>
        <ul class="text-truncate">
          ${getFilesList(path.join(myGroup, 'courses', lessonObj.lesson, lessonObj.id.toString(), 'material')).map(item => helperListitem(path.join(myGroup, 'courses', lessonObj.lesson, lessonObj.id.toString(), 'material'), item)).join('')}
        </ul>
        ${helperUpload(myGroup, lessonObj, studentId, curDay)}
        ${helperFinishButton(myGroup, lessonObj,studentId, curDay)}
      </div>
    </div>
  `;
}

function helperListitem (filePath, item, deleteable=false, curDay='') {
  let delButton = '';
  if (deleteable) {
    delButton = `
      <form id="delform-${item.split('.')[0]}" action="/filedelete" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="filePath" name="filePath" value="${filePath}">
        <input type="text" readonly class="d-none" id="delfilename" name="delfilename" value="${item}">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/student/day/${curDay}">
        <a href="#" onclick="fileDelete('delform-${item.split('.')[0]}')"><strong>[ X ]</strong></a>
      </form>
    `;
  }
  return `
    <li><div class="d-flex justify-content-between text-truncate"><a href="${path.join('/data/classes/', filePath, item)}" target="_blank">${item}</a>${delButton}</div></li>
  `;
}

function helperUpload (myGroup, lessonObj, studentId, curDay) {
  if (lessonObj.returnHomework === 'true') {
    return `
      <hr />
      <strong class="card-title">Uploads:</strong>
      <ul class="text-truncate">
        ${getFilesList(path.join(myGroup, 'courses', lessonObj.lesson, lessonObj.id.toString(), 'homework', studentId.toString())).map(item => helperListitem(path.join(myGroup, 'courses', lessonObj.lesson, lessonObj.id.toString(), 'homework', studentId.toString()), item, true, curDay)).join('')}
      </ul>
      <form class="row my-3 p-2 mx-0 align-item-center" action="/fileupload" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
        <input type="text" readonly class="d-none" id="course" name="course" value="${lessonObj.lesson}">
        <input type="text" readonly class="d-none" id="courseId" name="courseId" value="${lessonObj.id}">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/student/day/${curDay}">
        <div class="custom-file col-sm-9">
          <input type="file" class="custom-file-input" id="filetoupload-${lessonObj.id}" name="filetoupload">
          <label class="custom-file-label" for="filetoupload-${lessonObj.id}">Datei wählen...</label>
          <div class="invalid-feedback">Ups, da gab es einen Fehler</div>
        </div>
        <div class="col-sm-3 px-0 text-right">
          <button type="submit" class="btn btn-primary">Upload</button>
        </div>
      </form>
    `;
  } else {
    return '';
  }
}

function helperFinishButton (myGroup, lessonObj, studentId, curDay) {
  if (lessonObj.lessonFinished.includes(studentId)) {
    return '';
  } else {
    return `
      <hr />
      <form class="my-3 p-2 mx-0 text-right" action="/lessonfinished" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
        <input type="text" readonly class="d-none" id="courseId" name="courseId" value="${lessonObj.id}">
        <input type="text" readonly class="d-none" id="studentId" name="studentId" value="${studentId}">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/student/day/${curDay}">
        <button type="submit" class="btn btn-success">Finished</button>
      </form>
    `;
  }
}

function lessonIndicator (myGroup, lessonObj, studentId, curDay) {
  if (lessonObj.lessonFinished.includes(studentId)) {
    return '<span class="checkmark-ok-grey">&#10003;</span>';
  } else if (notValid(lessonObj.validUntil, momentFromDay(curDay))) {
    return `Abgabe: ${formatDay(thisDay(lessonObj.validUntil))}`;
  } else {
    let lessonsTotal = workdaysBetween(lessonObj.validFrom, lessonObj.validUntil, lessonObj.weekdays);
    let lessonsLeft = lessonsTotal + 1 - workdaysBetween(momentFromDay(curDay), lessonObj.validUntil, lessonObj.weekdays);
    return `${lessonsLeft}/${lessonsTotal}`;
  }
}


module.exports = studentDayView;
