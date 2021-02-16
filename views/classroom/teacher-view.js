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
const { usersOnline, getAllUsers } = require('../../models/model-user');
const formTextInputColumn = require('../templates/form-textinput-column');


function teacherView (group) {
  return `
    <div class="container border my-3 p-3 h-50">
      <div class="d-flex justify-content-between">
        <h2>${locale.headlines.create_onlinelesson[config.lang]}</h2>
        <h2>${group}</h2>
      </div>
      <form id="create-online-lesson-form" action="/classroom/${group}/create" method="post">
        <div class="row mt-3">
          ${formTextInputColumn('', 'lessonName')}
        </div>
        <div class="text-right">
          <button type="submit" class="btn btn-primary mt-3">${locale.buttons.start_onlinelesson[config.lang]}</button>
        </div>
      </form>
    </div>
  `;
}


module.exports = teacherView;
