/*!
 * views/admin/settings-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
//const locale = require('../../lib/locale');
//const config = require('../../models/model-config').getConfig();


function settingsView () {
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Settings
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">
          <form action="/admin/settings" method="post">
            <input type="text" name="action" class="d-none" hidden value="updatesettings" />
            <div class="form-group row mb-1">
              <label for="beerorwine-field" class="col-sm-3 col-form-label text-right">beer or wine</label>
              <div class="col-sm-9 my-2">
                <select class="form-control form-control-sm" id="beerorwine-field" name="beerorwine">
                  <option></option>
                  <option>Bier</option>
                  <option>Wein</option>
                </select>
              </div>
            </div>
            <button type="submit">update</button>
          </form>
        </div>
        <div class="col-12 col-md-6">
          <br /><br /><br /><br />

        </div>
      </div>
    </div>
  `;
}


// Additional functions


module.exports = settingsView;
