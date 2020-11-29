/*!
 * example/views/edit-lesson-view.js
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
const filesList = require('../templates/files-list');
let lessonsConfig = {};


function editLessonView (itemObj, myGroup, user) {
  lessonsConfig = require(path.join('../../data/classes/', myGroup,'/config.json'));
  let body = `
      <div class="container h-100 border py-2 px-3 my-3">
        <h2>${locale.headlines.add_edit_lesson[config.lang]} ${myGroup}</h2>
        <form id="edit-form-${myGroup}-${itemObj.id}" name="edit-form-${myGroup}-${itemObj.id}" action="/lessons/update" method="post">
          <input type="text" name="id" class="d-none" hidden value="${itemObj.id}" />
          <input type="text" name="group" class="d-none" hidden value="${myGroup}" />
          ${formInputs(itemObj, user.courses)}
          <div class="d-flex justify-content-end mb-3">
            <button type="button" class="btn btn-danger ${itemObj.id === '' ? 'd-none' : ''}" onclick="confirmDelete(this.form.name, \'/lessons/delete\')">${locale.buttons.delete[config.lang]}</button>
            <button type="button" class="btn btn-info ml-3" onclick="window.open('/lessons', '_top', '');">${locale.buttons.cancle[config.lang]}</a>
            <button type="submit" class="btn btn-primary ml-3">${locale.buttons.add_update[config.lang]}</button>
          </div>
        </form>
      </div>
      <div class="container h-100 border py-2 px-3 mb-3">
        <h4>${locale.headlines.th_uploads[config.lang]}:</h4>
        <div class="row">
          <div class="col-sm-8 offset-lg-2">
            ${itemObj.files ? filesList(itemObj.files, '/lessons/edit/'+myGroup+'/'+itemObj.id, myGroup, '', itemObj.id, '', true) : ''}
            <form class="row my-3 py-2 mx-0 align-item-center" action="/fileupload" method="post" enctype="multipart/form-data">
              <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
              <input type="text" readonly class="d-none" id="course" name="course" value="${itemObj.lesson}">
              <input type="text" readonly class="d-none" id="course" name="courseId" value="${itemObj.id}">
              <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/lessons/edit/${myGroup}/${itemObj.id}">
              <div class="custom-file col-sm-10">
                <input type="file" class="custom-file-input" id="filetoupload-${itemObj.id}" name="filetoupload">
                <label class="custom-file-label" for="filetoupload-${itemObj.id}">${locale.placeholder.choose_file[config.lang]}...</label>
                <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
              </div>
              <div class="col-sm-2 mt-2 mt-sm-0">
                <button type="submit" class="btn btn-primary">${locale.buttons.upload[config.lang]}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  `;
  return body;
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
      if (key !== 'id' && key !== 'lessonFinished' && key !== 'files') {
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


module.exports = editLessonView;
