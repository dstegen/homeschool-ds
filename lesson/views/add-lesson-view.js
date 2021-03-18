/*!
 * lesson/views/add-lesson-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const lessonForm = require('./lesson-form');


function addLessonView (itemObj, myGroup, teacher) {
  return `
  <div class="container">
    <div class="border py-2 px-3 my-3">
      <h2>${locale.headlines.add_edit_lesson[config.lang]} ${myGroup}</h2>
    </div>
    <div class="border py-3 px-3 my-3">
      ${lessonForm(itemObj, myGroup, teacher)}
    </div>
  </div>
  `;
}


module.exports = addLessonView;
