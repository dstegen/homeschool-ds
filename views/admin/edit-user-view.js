/*!
 * views/admin/edit-user-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const config = require('../../models/model-config').getConfig();
const formSelectColumn = require('../templates/form-select-column');
const userForm = require('./user-form');


function editUserView (allUserIds, user) {
  let classes = Array.from(config.classes);
  classes.unshift('');
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Add/Update user
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <form action="/admin/edituser" method="post">
              <div class="form-group row mb-1">
                ${formSelectColumn(classes, '', 'choosegroup', 'onchange="selectGroup(this.value)"')}
              </div>
            </form>
          </div>
          <div class="border py-2 px-3 mb-3">
            <form action="/admin/edituser" method="post">
              <div class="form-group row mb-1">
                ${formSelectColumn(allUserIds, '', 'chooseuser', 'onchange="selectUser(this.value)"')}
              </div>
            </form>
          </div>
        </div>
        <div class="col-12 col-md-6">
          ${userForm(user, classes)}
        </div>
      </div>
    </div>
  `;
}


module.exports = editUserView;
