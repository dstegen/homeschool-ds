/*!
 * views/admin/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
//const config = require('../../models/model-config')();


function adminView (user) {
  if (user === undefined) {
    user = {
      userId: '',
      id: '',
      password: '',
      role: '',
      group: '',
      courses: '',
      fname: '',
      lname: '',
      email: '',
      phone: '',
      gender: ''
    };
  }
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">

        </div>
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h3>Add/Update user:</h3>
            <form action="/admin/updateuser" method="post">
              <input type="text" name="id" class="d-none" hidden value="${user.id}" />
              <div class="form-group row mb-1">
                ${Object.keys(user).map( key => helperInputs(user[key], key)).join('')}
              </div>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-info ml-3" onclick="window.open('/admin', '_top', '');">${locale.buttons.cancle['en']}</a>
                <button type="submit" class="btn btn-primary ml-3">${locale.buttons.add_update['en']}</button>
              </div>
            </form>
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function helperInputs (value, prop) {
  if ( prop !== 'id' && prop !== 'password') {
    let required = 'required';
    if ( prop === 'phone' || prop === 'email'|| prop === 'courses') required = '';
    switch (prop) {
      case 'role':
        return `
          <label for="${prop}-field" class="col-sm-3 col-form-label text-right">${prop}</label>
          <div class="col-sm-9">
            <select class="form-control form-control-sm" id="${prop}-field" name="${prop}" required>
              ${['','teacher','student'].map( item => helperSelectOption(item, value) ).join('')}
            </select>
          </div>
        `;
      case 'gender':
        return `
          <label for="${prop}-field" class="col-sm-3 col-form-label text-right">${prop}</label>
          <div class="col-sm-9">
            <select class="form-control form-control-sm" id="${prop}-field" name="${prop}" required>
              ${['','male','female'].map( item => helperSelectOption(item, value) ).join('')}
            </select>
          </div>
        `;
      default:
        return `
          <label for="${prop}-field" class="col-sm-3 col-form-label text-right mb-2">${prop}</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="${prop}-field" name="${prop}" value="${value}" ${required}>
          </div>
        `;
    }
  } else {
    return '';
  }
}

function helperSelectOption (item, value) {
  return `
    <option ${value === item?'selected':''}>${item}</option>
  `;
}

module.exports = adminView;
