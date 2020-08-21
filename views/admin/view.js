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
const { getTitleNameById } = require('../../models/model-user');


function adminView (user) {
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
          <br /><br /><br /><br />

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
