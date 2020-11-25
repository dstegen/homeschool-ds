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
let lessonsConfig = {};


function editLessonView (itemObj, myGroup, user) {
  lessonsConfig = require(path.join('../../data/classes/', myGroup,'/config.json'));
  let body = `
      <div class="container h-100 border py-2 px-3 my-3">
        <h2>${locale.headlines.add_edit_lesson[config.lang]} ${myGroup}</h2>
        <form id="edit-form-${myGroup}-${itemObj.id}" name="edit-form-${myGroup}-${itemObj.id}" action="/update" method="post">
          <input type="text" name="id" class="d-none" hidden value="${itemObj.id}" />
          <input type="text" name="group" class="d-none" hidden value="${myGroup}" />
          ${formInputs(itemObj, user.courses)}
          <div class="d-flex justify-content-end mb-3">
            <button type="button" class="btn btn-danger ${itemObj.id === '' ? 'd-none' : ''}" onclick="confirmDelete(this.form.name, \'/delete\')">${locale.buttons.delete[config.lang]}</button>
            <button type="button" class="btn btn-info ml-3" onclick="window.open('/teacher/lessons', '_top', '');">${locale.buttons.cancle[config.lang]}</a>
            <button type="submit" class="btn btn-primary ml-3">${locale.buttons.add_update[config.lang]}</button>
          </div>
        </form>
      </div>
      <div class="container h-100 border py-2 px-3 mb-3">
        <h4>${locale.headlines.th_uploads[config.lang]}:</h4>
        <div class="row">
          <div class="col-sm-10 offset-lg-2">
          <ul class="text-truncate pl-3 w-75">
            ${itemObj.files && itemObj.files.length > 0 ? itemObj.files.map(item => helperListitem(item, item.split('/').pop(), true, myGroup, itemObj.id)).join('') : ''}
          </ul>
          <form class="row my-3 py-2 mx-0 align-item-center" action="/fileupload" method="post" enctype="multipart/form-data">
            <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
            <input type="text" readonly class="d-none" id="course" name="course" value="${itemObj.lesson}">
            <input type="text" readonly class="d-none" id="course" name="courseId" value="${itemObj.id}">
            <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/edit/${myGroup}/${itemObj.id}">
            <div class="custom-file col-sm-7">
              <input type="file" class="custom-file-input" id="filetoupload-${itemObj.id}" name="filetoupload">
              <label class="custom-file-label" for="filetoupload-${itemObj.id}">${locale.placeholder.choose_file[config.lang]}...</label>
              <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
            </div>
            <div class="col-sm-3 mt-2 mt-sm-0">
              <button type="submit" class="btn btn-primary">${locale.buttons.upload[config.lang]}</button>
            </div>
          </form>
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

function helperListitem (filePath, item, deleteable=false, myGroup='00', itemId) {
  let delButton = '';
  if (deleteable) {
    delButton = `
      <form id="delform-${item.split('.')[0]}" action="/filedelete" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="filePath" name="filePath" value="${filePath}">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/edit/${myGroup}/${itemId}">
        <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
        <input type="text" readonly class="d-none" id="courseId" name="courseId" value="${itemId}">
        <a href="#" onclick="fileDelete('delform-${item.split('.')[0]}')">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </a>
      </form>
    `;
  }
  return `
    <li><div class="d-flex justify-content-between text-truncate"><a href="${filePath}" target="_blank">${item}</a>${delButton}</li>
  `;
}


module.exports = editLessonView;
