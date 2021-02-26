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
  let lessonsSelectArray = myLessons.filter(item => !notValid(item.validUntil)).map( item => { return [item.id, item.lesson+' - '+item.chapter]; });
  lessonsSelectArray.unshift(['','']);
  return `
    <div class="container border my-3 p-3 h-50">
      <div class="d-flex justify-content-between">
        <h2>${locale.headlines.start_onlinelesson[config.lang]}</h2>
        <h2>${group}</h2>
      </div>
      <form class="w-75 pt-3" id="create-online-lesson-form" action="/classroom/${group}/create" method="post">
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
        <hr />
        <div class="row mt-3">
          ${formCheckboxColumn(['jitsi', 'chalkboard', 'docs', 'youtube', 'classchat'], 'options', ['jitsi', 'docs'], [])}
        </div>
        <div class="text-right">
          <button type="submit" class="btn btn-primary mt-3">${locale.buttons.start_onlinelesson[config.lang]}</button>
        </div>
      </form>
    </div>
  `;
}


module.exports = teacherView;
