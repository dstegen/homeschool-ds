/*!
 * views/lessons/lesson-form.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { weekDay } = require('../../lib/dateJuggler');
let lessonsConfig = {};



function lessonForm (itemObj, myGroup, user) {
  lessonsConfig = require(path.join('../../data/classes/', myGroup,'/config.json'));
  return `
    <form id="edit-form-${myGroup}-${itemObj.id}" name="edit-form-${myGroup}-${itemObj.id}" action="/lessons/update" method="post">
      <input type="text" name="id" class="d-none" hidden value="${itemObj.id}" />
      <input type="text" id="group" name="group" class="d-none" hidden value="${myGroup}" />
      <input type="text" class="d-none" hidden class="d-none" id="urlPath" name="urlPath" value="/lessons/show/${myGroup}/${itemObj.id}">
      ${formInputs(itemObj, user.courses)}
      <div class="d-flex justify-content-end mb-3">
        <button type="button" class="btn btn-danger ${itemObj.id === '' ? 'd-none' : ''}" onclick="confirmDelete(this.form.name, \'/lessons/delete\')">${locale.buttons.delete[config.lang]}</button>
        <button type="button" class="btn btn-info ml-3" data-toggle="collapse" data-target="#lesson-form" onclick="javascript: $('#lesson-details').collapse('toggle');">${locale.buttons.cancle[config.lang]}</a>
        <button type="submit" class="btn btn-primary ml-3">${itemObj.id === '' ? locale.buttons.add[config.lang] : locale.buttons.update[config.lang]}</button>
      </div>
    </form>
  `;
}


// Additional functions

function formInputs (itemObj, courses) {
  let fieldTypes = {
    weekdays: 'checkbox',
    validFrom: 'date',
    validUntil: 'date',
    lesson: 'select',
    details: 'textarea',
    returnHomework: 'select2'
  }
  let returnHtml = '';
  if (Object.keys(itemObj).length > 0) {
    Object.keys(itemObj).forEach( key => {
      if (key !== 'id' && key !== 'lessonFinished' && key !== 'files' && key !== 'urlPath') {
        returnHtml += `<div class="form-group row mb-1">`;
        switch (fieldTypes[key]) {
          case 'checkbox':
            returnHtml += `<label for="${key}-field" class="col-sm-2 col-form-label text-right">${key}</label>`;
            returnHtml += `<div class="col-sm-10">`;
            [1,2,3,4,5,6].forEach( item => {
              let checked = '';
              if (itemObj[key].includes(item)) checked = 'checked';
              returnHtml += `
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="${key}-${item}" name="${key}" value="${item}" ${checked}>
                  <label class="form-check-label" for="${key}-${item}">${weekDay(item)}</label>
                </div>
              `;
            });
            returnHtml += `</div>`;
            break;
          case 'date':
            returnHtml += `
              <label for="${key}-field" class="col-sm-2 col-form-label text-right">${key}</label>
              <div class="col-sm-2">
                <input type="date" class="form-control" id="${key}-field" name="${key}" value="${itemObj[key]}" required>
              </div>
            `;
            break;
          case 'textarea':
            returnHtml += `
            <label for="${key}-field" class="col-sm-2 col-form-label text-right">${key}</label>
            <div class="col-sm-7">
              <textarea class="form-control" id="${key}-field" rows="3" name="${key}">${itemObj[key]}</textarea>
            </div>
            `;
            break;
          case 'select':
            returnHtml += `
              <label for="${key}-field" class="col-sm-2 col-form-label text-right">${key}</label>
              <div class="col-sm-7">
                <select class="form-control form-control-sm" id="${key}-field" name="${key}" required ${itemObj.id !== '' ? 'disabled' : ''}>
            `;
            lessonsConfig.courses.map( item => { return item.name; }).forEach( item => {
              if (courses.includes(item) || courses[0] === 'all') {
                returnHtml += `<option ${itemObj[key] === item ? 'selected':''}>${item}</option>`
              }
            });
            returnHtml += `
                </select>
              </div>
            `;
            break;
          case 'select2':
            returnHtml += `
              <label for="${key}-field" class="col-sm-2 col-form-label text-right">${key}</label>
              <div class="col-sm-7">
                <select class="form-control form-control-sm" id="${key}-field" name="${key}" required>
                  <option ${itemObj.returnHomework === 'false'?'selected':''}>false</option>
                  <option ${itemObj.returnHomework === 'true'?'selected':''}>true</option>
                </select>
              </div>
            `;
            break;
          default:
          returnHtml += `
            <label for="${key}-field" class="col-sm-2 col-form-label text-right">${key}</label>
            <div class="col-sm-7">
              <input type="text" class="form-control" id="${key}-field" name="${key}" value="${itemObj[key]}">
            </div>
          `;
        }
        returnHtml += `</div>`;
      }
    });
  }
  return returnHtml;
}


module.exports = lessonForm;