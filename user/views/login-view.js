/*!
 * user/views/login-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const getNaviObj = require('../../views/lib/getNaviObj');
const view = require('../../views/view');


function loginView (wsport, message='') {
  let body = `
   <!-- Loginform -->
    <div class="container d-flex justify-content-center py-5">
      <div class="card loginform-card">
        <div class="card-body">
          <h2 class="card-title">${locale.headlines.please_login[config.lang]}</h2>
          <form action="/login" method="post" enctype="application/x-www-form-urlencoded" name="login-form">
            <input type="text" readonly class="d-none" id="action" name="action" value="login">
            <div class="form-group">
              <label for="login-email">${locale.login.email_address[config.lang]}</label>
              <input type="email" class="form-control" id="username" name="username" placeholder="${locale.placeholder.email[config.lang]}">
            </div>
            <div class="form-group">
              <label for="login-password">${locale.login.password[config.lang]}</label>
              <input type="password" class="form-control" id="password" name="password" placeholder="${locale.placeholder.password[config.lang]}">
            </div>
            <div class=" d-flex justify-content-end">
              <button type="submit" class="btn btn-secondary">
                ${locale.buttons.login[config.lang]}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="container text-center">
      <p class="text-danger pb-5">
        ${message}
      </p>
    </div>
   `;
  return view(wsport, getNaviObj(), body);
}


module.exports = loginView;
