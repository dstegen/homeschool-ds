/*!
 * student/views/day-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { thisWeek, thisDay, weekDayNumber, formatDay, momentFromDay, workdaysBetween, notValid } = require('../../lib/dateJuggler');
const { lessonsToday, lessonsNotFinished } = require('../../models/model-lessons');
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
          ${myLessonsToday.length === 0 ? '<div class="text-muted w-100 text-center mt-4">- '+locale.student.no_lessons[config.lang]+' -</div>' : ''}
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
    returnHtml += '<h6 class="text-center text-danger my-4">'+locale.student.not_finished_lessons[config.lang]+':</h6>'
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
        ${lessonObj.details != '' ? `<strong class="card-title">${locale.student.exercise[config.lang]}:</strong><p class="card-text">${lessonObj.details}</p>` : ''}
        ${helperDownloads(lessonObj, lessonColor)}
        ${helperUpload(myGroup, lessonObj, studentId, curDay, lessonColor)}
        ${helperFinishButton(myGroup, lessonObj, studentId, curDay)}
      </div>
    </div>
  `;
}

function helperDownloads (lessonObj, lessonColor) {
  let downloadsList = [];
  if (lessonObj.files) downloadsList = lessonObj.files;
  if (downloadsList.length > 0) {
    return `
      <strong class="card-title">${locale.student.downloads[config.lang]}:</strong>
      <ul class="text-truncate">
        ${downloadsList.map(item => {
          return `<li class="text-truncate"><a href="${item}" class="${lessonColor}" target="_blank">${item.split('/').pop()}</a></li>`;
        }).join('')}
      </ul>
    `;
  } else {
    return '';
  }
}

function helperListitem (filePath, deleteable=false, curDay='', lessonColor, studentId, lessonId, group) {
  let delButton = '';
  let tmpFile = filePath.split('/').pop();
  if (deleteable) {
    delButton = `
      <form id="delform-${tmpFile.split('.')[0]}" action="/filedelete" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="filePath" name="filePath" value="${filePath}">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/student/day/${curDay}">
        <input type="text" readonly class="d-none" id="group" name="group" value="${group}">
        <input type="text" readonly class="d-none" id="studentId" name="studentId" value="${studentId}">
        <input type="text" readonly class="d-none" id="lessonId" name="lessonId" value="${lessonId}">
        <a href="#" class="${lessonColor} mr-2" onclick="fileDelete('delform-${tmpFile.split('.')[0]}')">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </a>
      </form>
    `;
  }
  return `
    <li><div class="d-flex justify-content-between text-truncate"><a href="${filePath}" class="${lessonColor}" target="_blank">${tmpFile}</a>${delButton}</div></li>
  `;
}

function helperUpload (myGroup, lessonObj, studentId, curDay, lessonColor) {
  if (lessonObj.returnHomework === 'true') {
    return `
      <hr />
      <strong class="card-title">${locale.student.uploads[config.lang]}:</strong>
      <ul class="text-truncate">
        ${lessonObj.lessonFinished.filter( item => item.studentId = studentId)[0].files.map(item => helperListitem(item, true, curDay, lessonColor, studentId, lessonObj.id, myGroup)).join('')}
      </ul>
      <form class="row my-3 p-2 mx-0 align-item-center" action="/fileupload" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
        <input type="text" readonly class="d-none" id="course" name="course" value="${lessonObj.lesson}">
        <input type="text" readonly class="d-none" id="courseId" name="courseId" value="${lessonObj.id}">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/student/day/${curDay}">
        <div class="custom-file col-sm-9">
          <input type="file" class="custom-file-input" id="filetoupload-${lessonObj.id}" name="filetoupload">
          <label class="custom-file-label" for="filetoupload-${lessonObj.id}">${locale.placeholder.choose_file[config.lang]}...</label>
          <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
        </div>
        <div class="col-sm-3 px-0 text-right">
          <button type="submit" class="btn btn-primary">${locale.buttons.upload[config.lang]}</button>
        </div>
      </form>
    `;
  } else {
    return '';
  }
}

function helperFinishButton (myGroup, lessonObj, studentId, curDay) {
  if (lessonObj.lessonFinished.map( item => { return item.studentId } ).includes(studentId)) {
    return '';
  } else {
    return `
      <hr />
      <form class="my-3 p-2 mx-0 text-right" action="/lessonfinished" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
        <input type="text" readonly class="d-none" id="courseId" name="courseId" value="${lessonObj.id}">
        <input type="text" readonly class="d-none" id="studentId" name="studentId" value="${studentId}">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/student/day/${curDay}">
        <button type="submit" class="btn btn-success">${locale.buttons.finish_lesson[config.lang]}</button>
      </form>
    `;
  }
}

function lessonIndicator (myGroup, lessonObj, studentId, curDay) {
  if (lessonObj.lessonFinished.map( item => { return item.studentId } ).includes(studentId)) {
    return '<span class="checkmark-ok-grey">&#10003;</span>';
  } else if (notValid(lessonObj.validUntil, momentFromDay(curDay))) {
    return `${locale.student.return_date[config.lang]}: ${formatDay(thisDay(lessonObj.validUntil))}`;
  } else {
    let lessonsTotal = workdaysBetween(lessonObj.validFrom, lessonObj.validUntil, lessonObj.weekdays);
    let lessonsLeft = lessonsTotal + 1 - workdaysBetween(momentFromDay(curDay), lessonObj.validUntil, lessonObj.weekdays);
    return `${lessonsLeft}/${lessonsTotal}`;
  }
}


module.exports = studentDayView;
