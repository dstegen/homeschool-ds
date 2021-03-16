/*!
 * lesson/views/lesson-upload-form.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const filesList = require('../../views/templates/files-list');

function lessonUploadForm (itemObj, myGroup) {
  return `
  <div class="row">
    <div class="col-sm-8 offset-lg-2">
      ${itemObj.files ? filesList(itemObj.files, '/lessons/show/'+myGroup+'/'+itemObj.id, myGroup, '', itemObj.id, '', true) : ''}
      <form class="row my-3 py-2 mx-0 align-item-center" action="/fileupload" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="group" name="group" value="${myGroup}">
        <input type="text" readonly class="d-none" id="course" name="course" value="${itemObj.lesson}">
        <input type="text" readonly class="d-none" id="course" name="courseId" value="${itemObj.id}">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="${itemObj.id ? '/lessons/show/'+myGroup+'/'+itemObj.id : '/lessons'}">
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
  `;
}



module.exports = lessonUploadForm;
