/*!
 * views/lib/getBody.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';


function getBody (myLessons) {
  return `
  <div id="dashboard" class="container my-3 p-3 border collapse" data-parent="#homeschool-ds">
    <h2>Dashboard</h2>
    <hr />
  </div>
  <div id="today" class="container my-3 p-3 border collapse" data-parent="#homeschool-ds">
    <h2>Heute</h2>
    <hr />
    <div class="row text-center">
      <div class="col-6 border-right">
        ${myLessons.map(lesson => helperLessonBig(lesson, 1)).join('')}
      </div>
    </div>
  </div>
  <div id="week" class="container my-3 p-3 border collapse show" data-parent="#homeschool-ds">
    <h2>Diese Woche</h2>
    <hr />
    <div class="row text-center">
      <div class="col-2 border-right">
        <h5>Montag</h5>
        ${myLessons.map(lesson => helperLesson(lesson, 1)).join('')}
      </div>
      <div class="col-2 border-right">
        <h5>Dienstag</h5>
        ${myLessons.map(lesson => helperLesson(lesson, 2)).join('')}
      </div>
      <div class="col-2 border-right">
        <h5>Mittwoch</h5>
        ${myLessons.map(lesson => helperLesson(lesson, 3)).join('')}
      </div>
      <div class="col-2 border-right">
        <h5>Donnerstag</h5>
        ${myLessons.map(lesson => helperLesson(lesson, 4)).join('')}
      </div>
      <div class="col-2 border-right">
        <h5>Freitag</h5>
        ${myLessons.map(lesson => helperLesson(lesson, 5)).join('')}
      </div>
      <div class="col-2">
        <h5>Samstag</h5>
        <span class="text-muted">- kein Unterricht -</span>
      </div>
    </div>
  </div>
  `;
}


// Additional functions

function helperLesson (lessonObj, curDay) {
  if (lessonObj.weekdays.includes(curDay)) {
    return `
      <div class="card lesson text-white ${lessonObj.color} mt-2 text-left">
        <div id="lesson-${lessonObj.id}${curDay}" class="card-header px-2 py-1" onclick="$('#lesson-details-${lessonObj.id}${curDay}').collapse('toggle');">
          ${lessonObj.lesson}: ${lessonObj.chapter}
        </div>
        <div id="lesson-details-${lessonObj.id}${curDay}" class="card-body collapse px-2 py-1" data-parent="#week">
          <strong class="card-title">Aufgabe:</strong>
          <p class="card-text">${lessonObj.details}</p>
        </div>
      </div>
    `;
  } else {
    return '';
  }
}

function helperLessonBig (lessonObj, curDay) {
  if (lessonObj.weekdays.includes(curDay)) {
    return `
      <div class="card lessonbig text-white ${lessonObj.color} mt-2 text-left">
        <div id="lessonbig-${lessonObj.id}${curDay}" class="card-header" onclick="$('#lessonbig-details-${lessonObj.id}${curDay}').collapse('toggle');">
          ${lessonObj.lesson}: ${lessonObj.chapter}
        </div>
        <div id="lessonbig-details-${lessonObj.id}${curDay}" class="card-body collapse" data-parent="#today">
          <strong class="card-title">Aufgabe:</strong>
          <p class="card-text">${lessonObj.details}</p>
        </div>
      </div>
    `;
  } else {
    return '';
  }
}


module.exports = getBody;
