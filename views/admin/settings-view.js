/*!
 * views/admin/settings-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const { getGroupConfig } = require('../../models/model-config');
const config = require('../../models/model-config').getConfig();


function settingsView (group='') {
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Settings
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h3>School-Config</h3>
            <form action="/admin/settings" method="post">
              <input type="text" name="action" class="d-none" hidden value="updatesettings" />
              <div class="form-group row mb-1">
                ${Object.keys(config).map( key => helperInputs(config[key], key)).join('')}
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
                <label for="newGroup-field" class="col-sm-3 col-form-label text-right mb-2">newGroup</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="newGroup-field" name="newGroup" value="" required>
                </div>
              </div>
              <div class="d-flex justify-content-end mb-2">
                <button type="submit" class="btn btn-primary ml-3">Add new class</button>
              </div>
            </form>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h3>Edit class/group settings</h3>
            <form action="/admin/edituser" method="post">
              <div class="form-group row mb-1">
                <label for="choosegroup-field" class="col-sm-3 col-form-label text-right">seletc group</label>
                <div class="col-sm-9 my-2">
                  <select class="form-control form-control-sm" id="choosegroup-field" name="choosegroup" onchange="selectGroupSettings(this.value)">
                    <option></option>
                    ${config.classes.map( item => helperSelectOption(item, '') ).join('')}
                  </select>
                </div>
              </div>
            </form>
          </div>
          ${group !== '' ? helperGroupSettings(group) : ''}
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function helperGroupSettings (group) {
  if (group && group !== '') {
    return `
      <div class="border py-2 px-3 mb-3">
        <h5>Course-Config for class/group ${group}</h5>
        <form action="/admin/settings" method="post">
          <input type="text" name="action" class="d-none" hidden value="updategroupsettings" />
          <input type="text" name="group" class="d-none" hidden value="${group}" />
          <div class="form-group row mb-1">
          ${getGroupConfig(group).courses.map( item => helperSelects(config.courseColors, item.color, item.name)).join('')}
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
            <label for="newCourse-field" class="col-sm-3 col-form-label text-right mb-2">newCourse</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="newCourse-field" name="newCourse" value="" required>
            </div>
            ${helperSelects(config.courseColors, '', 'color')}
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

function helperSelects (optionsList, value, prop) {
  return `
    <label for="${prop}-field" class="col-sm-3 col-form-label text-right">${prop}</label>
    <div class="col-sm-9 mb-2">
      <select class="form-control form-control-sm" id="${prop}-field" name="${prop}" required>
        ${optionsList.map( item => helperSelectOption(item, value) ).join('')}
      </select>
    </div>
  `;
}

function helperInputs (value, prop) {
  if (prop !== 'id' && prop !== 'classes') {
    let required = 'required';
    switch (prop) {
      case 'lang':
        return `
          <label for="${prop}-field" class="col-sm-3 col-form-label text-right">${prop}</label>
          <div class="col-sm-9 mb-2">
            <select class="form-control form-control-sm" id="${prop}-field" name="${prop}" required>
              ${['en','de'].map( item => helperSelectOption(item, value) ).join('')}
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


module.exports = settingsView;
