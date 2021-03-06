/*!
 * views/classroom/teacher-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { getLessons } = require('../../models/model-lessons');
const formTextInputColumn = require('../templates/form-textinput-column');
const formSelectColumn = require('../templates/form-select-column');
const formCheckboxColumn = require('../templates/form-checkbox-column');
const { notValid } = require('../../lib/dateJuggler');


function teacherView (group) {
  let myLessons = getLessons(group);
  let lessonsSelectArray = myLessons.filter(item => !notValid(item.validUntil) && item.lessonType === 'onlinelesson').map( item => { return [item.id, item.lesson+' - '+item.chapter]; });
  lessonsSelectArray.unshift(['','']);
  return `
    <div class="container border my-3 p-3 h-50">
      <div class="d-flex justify-content-between">
        <h2>${locale.headlines.start_onlinelesson[config.lang]}</h2>
        <h2>${group}</h2>
      </div>
      <form class="w-75 pt-3" id="create-online-lesson-form" action="/classroom/${group}/create" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="group" name="group" value="${group}">
        <div class="row">
          <h5 class="col-sm-3 text-right">${locale.headlines.chose_onlinelesson[config.lang]}:</h5>
        </div>
        <div class="row mt-3">
          ${formSelectColumn(lessonsSelectArray, '', 'lessonId', 'onchange="$(\'#lessonName-field\').removeAttr(\'required\');"', '', '')}
        </div>
        <hr />
        <div class="row">
          <h5 class="col-sm-3 text-right">${locale.headlines.create_onlinelesson[config.lang]}:</h5>
        </div>
        <div class="row mt-3">
          ${formTextInputColumn('', 'lessonName', 'required')}
          <div class="col-sm-3"></div>
        </div>
        <div class="row mt-3">
          ${formTextInputColumn('', 'youtubeId', '')}
        </div>
        <div class="row mt-3">
          <div class="col-sm-3 col-form-label text-right mb-2">
            filetoupload
          </div>
          <div class="col-sm-9 custom-file">
            <input type="file" class="custom-file-input" id="filetoupload-${group}" name="filetoupload">
            <label class="custom-file-label mx-3" for="filetoupload-${group}">${locale.placeholder.choose_file[config.lang]}...</label>
            <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
          </div>
        </div>
        <hr />
        <div class="row mt-3">
          ${formCheckboxColumn(['jitsi', 'chalkboard', 'docs', 'youtube', 'classchat'], 'options', ['jitsi', 'docs'], [])}
        </div>
        <div class="row mt-3">
          <div class="col-sm-3 col-form-label text-right mb-2">
            chalkboardBg
          </div>
          <div class="col-sm-9 custom-file">
            <input type="file" class="custom-file-input" id="chalkboardBg" name="chalkboardBg">
            <label class="custom-file-label mx-3" for="chalkboardBg">${locale.placeholder.choose_file[config.lang]}...</label>
            <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
          </div>
        </div>
        <div class="text-right">
          <button type="submit" class="btn btn-primary mt-3">${locale.buttons.start_onlinelesson[config.lang]}</button>
        </div>
      </form>
    </div>
  `;
}


module.exports = teacherView;
