/*!
 * views/admin/edit-user-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { getAllUsers } = require('../../models/model-user');

function editUserView (group, user) {
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
  let allUsers = getAllUsers();
  if (group !== undefined) {
    allUsers = allUsers.filter( item => item.group.includes(group) );
  }
  let allUserIds = allUsers.map( item => { return [item.id, item.fname+' '+item.lname+', '+item.group] } );
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
                <label for="choosegroup-field" class="col-sm-3 col-form-label text-right">filter group</label>
                <div class="col-sm-9 my-2">
                  <select class="form-control form-control-sm" id="choosegroup-field" name="choosegroup" onchange="selectGroup(this.value)">
                    <option></option>
                    ${config.classes.map( item => helperSelectOption(item, '') ).join('')}
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="border py-2 px-3 mb-3">
            <form action="/admin/edituser" method="post">
              <div class="form-group row mb-1">
                <label for="chooseuser-field" class="col-sm-3 col-form-label text-right">choose user</label>
                <div class="col-sm-9 my-2">
                  <select class="form-control form-control-sm" id="choosegroup-field" name="chooseuser" onchange="selectUser(this.value)">
                    <option></option>
                    ${allUserIds.map( item => helperSelectOption(item, '') ).join('')}
                  </select>
                </div>
              </div>
            </form>
          </div>

        </div>
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h3>Add/Update user:</h3>
            <form action="/admin/updateuser" method="post">
              <input type="text" name="id" class="d-none" hidden value="${user.id}" />
              <div class="form-group row mb-1">
                ${Object.keys(user).map( key => helperInputs(user[key], key)).join('')}
              </div>
              <div class="d-flex justify-content-end mb-2">
                <button type="button" class="btn btn-info ml-3" onclick="window.open('/admin', '_top', '');">${locale.buttons.cancle['en']}</a>
                <button type="submit" class="btn btn-primary ml-3">${locale.buttons.add_update['en']}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function helperInputs (value, prop) {
  if (prop !== 'id') {
    let required = 'required';
    if (prop === 'phone' || prop === 'email'|| prop === 'courses' || prop === 'password') required = '';
    if (prop === 'password') value = '';
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
      case 'group':
        return `
          <label for="${prop}-field" class="col-sm-3 col-form-label text-right">${prop}</label>
          <div class="col-sm-9 my-2">
            <select multiple class="form-control form-control-sm" id="${prop}-field" name="${prop}" required>
              ${config.classes.map( item => helperSelectOption(item, value) ).join('')}
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
  let myValue = item;
  if (typeof(item) === 'object') {
    myValue = item[0];
    item = item[1];
  }
  let selected = '';
  if (value.includes(item)) selected = 'selected'
  return `
    <option ${selected} value="${myValue}">${item}</option>
  `;
}

module.exports = editUserView;
