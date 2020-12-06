/*!
 * views/admin/school-settings.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const formSelectColumn = require('../templates/form-select-column');
const formTextInputColumn = require('../templates/form-textinput-column');


function schoolSettings () {
  return `
  <div class="border py-2 px-3 mb-3">
    <h3>School-Config</h3>
    <form action="/admin/settings" method="post">
      <input type="text" name="action" class="d-none" hidden value="updatesettings" />
      <div class="form-group row mb-1">
        ${formSelectColumn(['en','de'], config.lang, 'lang')}
        ${Object.keys(config).map( key => formTextInputColumn(config[key], key)).join('')}
      </div>
      <div class="d-flex justify-content-end mb-2">
        <button type="submit" class="btn btn-primary ml-3">${locale.buttons.update['en']}</button>
      </div>
    </form>
  </div>
  <div class="border py-2 px-3 mb-3">
    <h3>Add new class/group</h3>
    <form action="/admin/settings" method="post">
      <input type="text" name="action" class="d-none" hidden value="addgroup" />
      <div class="form-group row mb-1">
      ${formTextInputColumn('', 'newGroup')}
      </div>
      <div class="d-flex justify-content-end mb-2">
        <button type="submit" class="btn btn-primary ml-3">Add new class</button>
      </div>
    </form>
  </div>
  `;
}


module.exports = schoolSettings;
