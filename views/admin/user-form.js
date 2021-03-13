/*!
 * views/admin/user-form.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const formSelect = require('../templates/form-select2');
const formTextInput = require('../templates/form-textinput');


function userForm (user, classes) {
  return `
    <div class="border py-2 px-3 mb-3">
      <h3>Add/Update user:</h3>
      <form action="/admin/updateuser" method="post">
        <input type="text" name="id" class="d-none" hidden value="${user.id}" />
        <div class="form-group row mb-1">
          ${Object.keys(user).map( key => helperInputs(user[key], key, classes)).join('<div class="w-100"></div>')}
        </div>
        <div class="d-flex justify-content-end mb-2">
          <button type="button" class="btn btn-info ml-3" onclick="window.open('/admin', '_top', '');">${locale.buttons.cancle['en']}</a>
          <button type="submit" class="btn btn-primary ml-3">${locale.buttons.add_update['en']}</button>
        </div>
      </form>
    </div>
  `;
}


// Additional functions

function helperInputs (value, prop, classes) {
  if (prop !== 'id') {
    let required = 'required';
    if (prop === 'phone' || prop === 'email'|| prop === 'courses' || prop === 'password') required = '';
    if (prop === 'password') value = '';
    switch (prop) {
      case 'role':
        return formSelect(['','teacher','student'], value, prop);
      case 'gender':
        return formSelect(['','male','female'], value, prop);
      case 'group':
        return formSelect(classes, value, prop, '', 'multiple');
      case 'leader':
        return formSelect(classes, value, prop, '', 'multiple');
      default:
        return formTextInput(value, prop, required);
    }
  } else {
    return '';
  }
}


module.exports = userForm;
