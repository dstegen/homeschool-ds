/*!
 * views/login-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const getNaviObj = require('./lib/getNaviObj');
const view = require('./view');


function loginView (wsport, message='') {
  let body = `
   <!-- Loginform -->
    <div class="container d-flex justify-content-center py-5">
      <div class="card loginform-card">
        <div class="card-body">
          <h2 class="card-title">Bitte anmelden</h2>
          <form action="/login" method="post" enctype="application/x-www-form-urlencoded" name="login-form">
            <input type="text" readonly class="d-none" id="action" name="action" value="login">
            <div class="form-group">
              <label for="login-email">E-Mail-Adresse</label>
              <input type="email" class="form-control" id="username" name="username" placeholder="E-Mail">
            </div>
            <div class="form-group">
              <label for="login-password">Passwort</label>
              <input type="password" class="form-control" id="password" name="password" placeholder="Passwort">
            </div>
            <div class=" d-flex justify-content-end">
              <button type="submit" class="btn btn-secondary">
                Login
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
