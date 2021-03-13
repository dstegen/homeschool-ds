/*!
 * views/admin/school-settings-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const config = require('../../models/model-config').getConfig();
const schoolSettings = require('./school-settings');


function schoolSettingsView () {
  let classes = Array.from(config.classes);
  classes.unshift('');
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        School-Settings
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div>
        ${schoolSettings()}
      </div>
    </div>
  `;
}


module.exports = schoolSettingsView;
