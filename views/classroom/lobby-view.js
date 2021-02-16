/*!
 * views/classroom/lobby-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { usersOnline, getAllUsers } = require('../../models/model-user');


function lobbyView (lesson) {
  return `
    <div class="container border my-3 p-3 h-50 text-center">
      <h2>Recent lesson: ${lesson}</h2>
      <p></p>
      <button class="btn btn-primary" onclick="requestClassroomAccess()">Request access</button>
    </div>
  `;
}


module.exports = lobbyView;
