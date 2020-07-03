/*!
 * student/views/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const lessonsConfig = require('../../data/classes/7A1/config.json');


function studentView (myLessons) {
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
      <div class="col-12 col-md-6 col-lg-2 border-right mb-5 mb-lg-0">
        <h5>Montag</h5>
        ${myLessons.map(lesson => helperLesson(lesson, 1)).join('')}
      </div>
      <div class="col-12 col-md-6 col-lg-2 border-right mb-5 mb-lg-0">
        <h5>Dienstag</h5>
        ${myLessons.map(lesson => helperLesson(lesson, 2)).join('')}
      </div>
      <div class="col-12 col-md-6 col-lg-2 border-right mb-5 mb-lg-0">
        <h5>Mittwoch</h5>
        ${myLessons.map(lesson => helperLesson(lesson, 3)).join('')}
      </div>
      <div class="col-12 col-md-6 col-lg-2 border-right mb-5 mb-lg-0">
        <h5>Donnerstag</h5>
        ${myLessons.map(lesson => helperLesson(lesson, 4)).join('')}
      </div>
      <div class="col-12 col-md-6 col-lg-2 border-right mb-5 mb-lg-0">
        <h5>Freitag</h5>
        ${myLessons.map(lesson => helperLesson(lesson, 5)).join('')}
      </div>
      <div class="col-12 col-md-6 col-lg-2 mb-5 mb-lg-0">
        <h5>Samstag</h5>
        <span class="text-muted">- kein Unterricht -</span>
      </div>
    </div>
  </div>
  `;
}


// Additional functions

function helperLesson (lessonObj, curDay) {
  let lessonColor = '';
  if (lessonsConfig.courses.filter( item => item.name === lessonObj.lesson).length > 0) {
    lessonColor = lessonsConfig.courses.filter( item => item.name === lessonObj.lesson)[0].color;
  }
  if (lessonObj.weekdays.includes(curDay)) {
    return `
      <div class="card lesson ${lessonColor} mt-2 text-left">
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
  let lessonColor = '';
  if (lessonsConfig.courses.filter( item => item.name === lessonObj.lesson).length > 0) {
    lessonColor = lessonsConfig.courses.filter( item => item.name === lessonObj.lesson)[0].color;
  }
  if (lessonObj.weekdays.includes(curDay)) {
    return `
      <div class="card lessonbig ${lessonColor} mt-2 text-left">
        <div id="lessonbig-${lessonObj.id}${curDay}" class="card-header" onclick="$('#lessonbig-details-${lessonObj.id}${curDay}').collapse('toggle');">
          ${lessonObj.lesson}: ${lessonObj.chapter}
        </div>
        <div id="lessonbig-details-${lessonObj.id}${curDay}" class="card-body collapse" data-parent="#today">
          <strong class="card-title">Aufgabe:</strong>
          <p class="card-text">${lessonObj.details}</p>
          <strong class="card-title">Downloads:</strong>
          <ul>
            <li><a href="#">aufgaben.pdf</a></li>
            <li><a href="#">erklärung.pdf</a></li>
            <li><a href="#">lösungen.pdf</a></li>
          </ul>
          <hr />
          <strong class="card-title">Uploads:</strong>
          <ul>
            <li><a href="#">aufgaben1.pdf</a></li>
            <li><a href="#">aufgaben2.jpg</a></li>
          </ul>
          <form class="row my-3 p-2 mx-0 align-item-center" action="/action" method="post" enctype="multipart/form-data">
            <input type="text" readonly class="d-none form_action" id="action" name="action" value="fileupload">
            <div class="custom-file col-sm-9">
              <input type="file" class="custom-file-input" id="filetoupload" name="filetoupload" required>
              <label class="custom-file-label" for="filetoupload">Datei hochladen...</label>
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


module.exports = studentView;
