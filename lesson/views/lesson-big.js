/*!
 * lesson/views/lesson-big.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { thisDay, formatDay, momentFromDay, workdaysBetween, notValid } = require('../../lib/dateJuggler');
const getIcon = require('../../main/views/get-icon');
const filesList = require('../../main/templates/files-list');
let lessonsConfig = {};


function lessonBig (lessonObj, curWeekDay, curDay, myGroup, studentId) {
  lessonsConfig = require(path.join('../../data/classes/', myGroup,'/config.json'));
  let lessonColor = '';
  if (lessonsConfig.courses.filter( item => item.name === lessonObj.lesson).length > 0) {
    lessonColor = lessonsConfig.courses.filter( item => item.name === lessonObj.lesson)[0].color;
  }
  return `
    <div class="card lessonbig ${lessonColor} mt-2 text-left">
      <div id="lessonbig-${lessonObj.id}" class="card-header d-flex justify-content-between" onclick="$('#lessonbig-details-${lessonObj.id}').collapse('toggle');">
        <span>${lessonObj.lesson}: ${lessonObj.chapter}</span>
        ${lessonIndicator(myGroup, lessonObj, studentId, curDay)}
      </div>
      <div id="lessonbig-details-${lessonObj.id}" class="card-body collapse" data-parent="#today">
        <p class="card-text">${lessonObj.details}</p>
        ${lessonObj.files ? filesList(lessonObj.files, '/lessons/day/'+curDay, myGroup, studentId, lessonObj.id, lessonColor, false) : ''}
        ${helperUpload(myGroup, lessonObj, studentId, curDay, lessonColor)}
        ${helperFinishButton(myGroup, lessonObj, studentId, curDay)}
      </div>
    </div>
  `;
}


// Additional functions

function lessonIndicator (myGroup, lessonObj, studentId, curDay) {
  if (lessonObj.lessonType === 'onlinelesson') {
    return '<span>' + lessonObj.time + ' ' + getIcon('onlinelesson', 'currentColor', '24') + '</span>';
  } else if (lessonObj.lessonFinished.filter( item => item.finished === true).map( item => { return item.studentId } ).includes(studentId)) {
    return '<span class="checkmark-ok-grey">&#10003;</span>';
  } else if (notValid(lessonObj.validUntil, momentFromDay(curDay))) {
    return `${locale.student.return_date[config.lang]}: ${formatDay(thisDay(lessonObj.validUntil))}`;
  } else {
    let lessonsTotal = workdaysBetween(lessonObj.validFrom, lessonObj.validUntil, lessonObj.weekdays);
    let lessonsLeft = lessonsTotal + 1 - workdaysBetween(momentFromDay(curDay), lessonObj.validUntil, lessonObj.weekdays);
    return `${lessonsLeft}/${lessonsTotal}`;
  }
}

function helperUpload (myGroup, lessonObj, studentId, curDay, lessonColor) {
  if (lessonObj.returnHomework === true) {
    return `
      <hr />
      <strong class="card-title">${locale.student.uploads[config.lang]}:</strong>
      <div class="pl-3">
        ${lessonObj.lessonFinished.filter( item => item.studentId === studentId).length > 0 ? filesList(lessonObj.lessonFinished.filter( item => item.studentId === studentId)[0].files, '/lessons/day/'+curDay, myGroup, studentId, lessonObj.id, lessonColor, true) : ''}
      </div>
      <form class="row my-3 p-2 mx-0 align-item-center" action="/fileupload" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
        <input type="text" readonly class="d-none" id="course" name="course" value="${lessonObj.lesson}">
        <input type="text" readonly class="d-none" id="courseId" name="courseId" value="${lessonObj.id}">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/lessons/day/${curDay}">
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
  if (lessonObj.lessonFinished.filter( item => item.finished === true).map( item => { return item.studentId } ).includes(studentId)) {
    return '';
  } else if (lessonObj.lessonType === 'onlinelesson') {
    return `
      <div class="text-right">
        <a class="btn btn-md btn-warning" href="/classroom">${locale.buttons.to_onelinelesson[config.lang]}</a>
      </div>
    `;
  } else {
    return `
      <hr />
      <form class="mt-3 mx-0 text-right" action="/lessons/lessonfinished" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
        <input type="text" readonly class="d-none" id="courseId" name="courseId" value="${lessonObj.id}">
        <input type="text" readonly class="d-none" id="studentId" name="studentId" value="${studentId}">
        <input type="text" readonly class="d-none" id="finished" name="finished" value="true">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/lessons/day/${curDay}">
        <button type="submit" class="btn btn-success">${locale.buttons.finish_lesson[config.lang]}</button>
      </form>
    `;
  }
}


module.exports = lessonBig;
