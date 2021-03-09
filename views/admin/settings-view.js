/*!
 * views/admin/settings-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const config = require('../../models/model-config').getConfig();
const schoolSettings = require('./school-settings');
const groupSettings = require('./group-settings');
const formSelectColumn = require('../templates/form-select-column');


function settingsView (group='') {
  let classes = Array.from(config.classes);
  classes.unshift('');
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Settings
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">
          ${schoolSettings()}
        </div>
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h3>Edit class/group settings</h3>
            <form action="/admin/edituser" method="post">
              <div class="form-group row mb-1">
                ${formSelectColumn(classes, '', 'choosegroup', 'onchange="selectGroupSettings(this.value)"')}
              </div>
            </form>
          </div>
          ${group !== '' ? groupSettings(group) : ''}
        </div>
      </div>
    </div>
  `;
}


module.exports = settingsView;
