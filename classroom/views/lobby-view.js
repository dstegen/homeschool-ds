/*!
 * classroom/views/lobby-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();


function lobbyView (recentLesson) {
  if (recentLesson.lesson === undefined) {
    return `
      <div class="container border my-3 p-3 h-50 text-center">
        <h5>${locale.headlines.no_lesson_yet[config.lang]}</h5>
      </div>
    `;
  } else {
    return `
      <div class="container border my-3 p-3 h-50 text-center">
        <h2>${locale.headlines.classroom[config.lang]}: ${recentLesson.lesson}</h2>
        <p></p>
        <button class="btn btn-primary" onclick="requestClassroomAccess()">${locale.buttons.request_access[config.lang]}</button>
      </div>
    `;
  }
}


module.exports = lobbyView;
