/*!
 * views/admin/group-settings.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { getGroupConfig } = require('../../models/model-config');
const formSelectColumn = require('../templates/form-select-column');
const formTextInputColumn = require('../templates/form-textinput-column');


function groupSettings (group) {
  if (group && group !== '') {
    return `
      <div class="border py-2 px-3 mb-3">
        <h5>Course-Config for class/group ${group}</h5>
        <form action="/admin/settings" method="post">
          <input type="text" name="action" class="d-none" hidden value="updategroupsettings" />
          <input type="text" name="group" class="d-none" hidden value="${group}" />
          <div class="form-group row mb-1">
          ${getGroupConfig(group).courses.map( item => formSelectColumn(config.courseColors, item.color, item.name)).join('')}
          </div>
          <div class="d-flex justify-content-end mb-2">
            <button type="submit" class="btn btn-primary ml-3">${locale.buttons.update['en']}</button>
          </div>
        </form>
      </div>
      <div class="border py-2 px-3 mb-3">
        <h5>Add new course to class/group ${group}</h5>
        <form action="/admin/settings" method="post">
          <input type="text" name="action" class="d-none" hidden value="updategroupsettings" />
          <input type="text" name="group" class="d-none" hidden value="${group}" />
          <div class="form-group row mb-1">
            ${formTextInputColumn('', 'newCourse')}
            ${formSelectColumn(config.courseColors, '', 'color')}
          </div>
          <div class="d-flex justify-content-end mb-2">
            <button type="submit" class="btn btn-primary ml-3">Add new course</button>
          </div>
        </form>
      </div>
    `;
  } else {
    return '';
  }
}


module.exports = groupSettings;
