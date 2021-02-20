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


function teacherView (group) {
  let myLessons = getLessons(group);
  let lessonsSelectArray = myLessons.map( item => { return [item.id, item.lesson+' - '+item.chapter]; });
  lessonsSelectArray.unshift(['','']);
  return `
    <div class="container border my-3 p-3 h-50">
      <div class="d-flex justify-content-between">
        <h2>${locale.headlines.create_onlinelesson[config.lang]}</h2>
        <h2>${group}</h2>
      </div>
      <form id="create-online-lesson-form" action="/classroom/${group}/create" method="post">
      <div class="row">
        <div class="col row mt-3">
          ${formTextInputColumn('', 'lessonName', '')}
        </div>
        <div class="col row mt-3">
          ${formTextInputColumn('', 'videos', '')}
        </div>
      </div>
      <div class="row">
        <div class="col row mt-3">
          ${formSelectColumn(lessonsSelectArray, '', 'lessonId', 'onchange', '', '')}
        </div>
        <div class="col text-right">
          <button type="submit" class="btn btn-primary mt-3">${locale.buttons.start_onlinelesson[config.lang]}</button>
        </div>
      </div>
      </form>
    </div>
  `;
}


module.exports = teacherView;
