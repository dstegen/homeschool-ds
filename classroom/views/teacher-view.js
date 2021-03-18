/*!
 * classroom/views/teacher-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { getLessons } = require('../../lesson/models/model-lessons');
const formTextInput = require('../../main/templates/form-textinput');
const formSelect = require('../../main/templates/form-select2');
const formCheckboxColumn = require('../../main/templates/form-checkbox');
const tooltip = require('../../main/templates/tooltip');
const { notValid } = require('../../lib/dateJuggler');


function teacherView (group) {
  let myLessons = getLessons(group);
  let lessonsSelectArray = myLessons.filter(item => !notValid(item.validUntil) && item.lessonType === 'onlinelesson').map( item => { return [item.id, item.lesson+' - '+item.chapter]; });
  lessonsSelectArray.unshift(['','']);
  let lessonOptions = formCheckboxColumn([[true, 'jitsi'], [true, 'chalkboard'], [true, 'docs'], [true, 'youtube'], [true, 'classchat']], 'options', ['docs'], ['jitsi'], false);
  try {
    const serverconf = require('../../serverconf');
    if (serverconf.meetServer !== undefined && serverconf.meetServer !== '') {
      lessonOptions = formCheckboxColumn([[true, 'jitsi'], [true, 'chalkboard'], [true, 'docs'], [true, 'youtube'], [true, 'classchat']], 'options', ['jitsi', 'docs'], [], false);
    }
  } catch (e) {
    console.log('- ERROR no serverconf.json found, Jitsi meet not available: '+e);
  }
  return `
    <div class="container border my-3 p-3 h-50">
      <div class="d-flex justify-content-between">
        <h2>${locale.headlines.start_onlinelesson[config.lang]}</h2>
        <h2>${group}</h2>
      </div>
      <form class="pt-3" id="create-online-lesson-form" action="/classroom/${group}/create" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="group" name="group" value="${group}">
        <div class="row mb-1">
          <h5 class="col-sm-2 text-right">${locale.headlines.chose_onlinelesson[config.lang]}:</h5>
        </div>

        <div class="form-group row mb-1">
          ${formSelect(lessonsSelectArray, '', 'lessonId', 'onchange="$(\'#lessonName-field\').removeAttr(\'required\');"', '', '')}
        </div>

        <hr />
        <div class="row mb-1">
          <h5 class="col-sm-2 text-right">${locale.headlines.create_onlinelesson[config.lang]}:</h5>
        </div>

        <div class="form-group row mb-1">
          ${formTextInput('', 'lessonName', 'required')}
        </div>

        <div class="form-group row mb-1">
          ${formTextInput('', 'youtubeId', '', tooltip(locale.tooltips.youtubeId[config.lang]))}
        </div>

        <div class="form-group row mb-1">
          <div class="col-sm-2 col-form-label text-right mb-2">
            filetoupload ${tooltip(locale.tooltips.filetoupload[config.lang])}
          </div>
          <div class="col-sm-7 custom-file">
            <input type="file" class="custom-file-input" id="filetoupload-${group}" name="filetoupload">
            <label class="custom-file-label mx-3" for="filetoupload-${group}">${locale.placeholder.choose_file[config.lang]}...</label>
            <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
          </div>
        </div>

        <hr />
        <div class="row mb-1">
          ${lessonOptions}
        </div>

        <div class="form-group row mb-1">
          <div class="col-sm-2 col-form-label text-right mb-2">
            chalkboardBg ${tooltip(locale.tooltips.chalkboardBg[config.lang])}
          </div>
          <div class="col-sm-7 custom-file">
            <input type="file" class="custom-file-input" id="chalkboardBg" name="chalkboardBg">
            <label class="custom-file-label mx-3" for="chalkboardBg">${locale.placeholder.choose_file[config.lang]}...</label>
            <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
          </div>
        </div>

        <div class="mb-1 text-right">
          <button type="submit" class="btn btn-primary">${locale.buttons.start_onlinelesson[config.lang]}</button>
        </div>
      </form>
    </div>
  `;
}


module.exports = teacherView;
