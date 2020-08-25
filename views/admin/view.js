/*!
 * views/admin/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { formatDay, getDaytime } = require('../../lib/dateJuggler');
const { getAllUsers, getTitleNameById, usersOnline } = require('../../models/model-user');
const { getMessagesCount } = require('../../models/model-messages');
const { getChat } = require('../../models/model-chat');


function adminView (user) {
  let chatMessagesCount = 0;
  config.classes.forEach( group => {
    chatMessagesCount += getChat(group).length;
  });

  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">
        <div class="border py-2 px-3 mb-3">
            <h4>${helperWelcome(config.lang)} ${getTitleNameById(user.id)},</h4>
            <p>
              ${locale.teacher.today_is[config.lang]} ${formatDay()}.
            </p>
            <br />

          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h4>Statistics:</h4>
            <p>
              Teachers: <strong>${getAllUsers().filter( item => item.role === 'teacher' ).length}</strong>
            </p>
            <p>
              Students: <strong>${getAllUsers().filter( item => item.role === 'student' ).length}</strong>
            </p>
            <p>
              Classes: <strong>${config.classes.length}</strong>
            </p>
            <hr />
            <p>
              Messages count: <strong>${getMessagesCount()}</strong>
            </p>
            <p>
              Chat count: <strong>${chatMessagesCount}</strong>
            </p>
            <hr />
            <p>
              Users online: <strong>${usersOnline()}</strong>
            </p>
            <br />
          </div>
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function helperWelcome (lang) {
  switch (getDaytime()) {
    case 'AM':
      return locale.teacher.welcome_morning[lang];
    case 'PM':
      return locale.teacher.welcome_afternoon[lang];
    case 'NIGHT':
      return locale.teacher.welcome_evening[lang];
    default:
      return locale.teacher.welcome_afternoon[lang];
  }
}


module.exports = adminView;
