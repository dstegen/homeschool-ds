/*!
 * lesson/views/lesson-form.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const loadFile = require('../../utils/load-file');
const formRadio = require('../../main/templates/form-radio');
const formCheckbox = require('../../main/templates/form-checkbox');
const formSelect = require('../../main/templates/form-select2');
const { weekDay, weeksArray } = require('../../lib/dateJuggler');
let lessonsConfig = {};


function lessonForm (itemObj, myGroup, user) {
  lessonsConfig = require(path.join('../../data/classes/', myGroup,'/config.json'));
  return `
    <form id="edit-form-${myGroup}-${itemObj.id}" name="edit-form-${myGroup}-${itemObj.id}" action="/lessons/update" method="post">
      <input type="text" name="id" class="d-none" hidden value="${itemObj.id}" />
      <input type="text" id="group" name="group" class="d-none" hidden value="${myGroup}" />
      <input type="text" id="urlPath" class="d-none" hidden class="d-none" name="urlPath" value="/lessons/show/${myGroup}/${itemObj.id}">
      ${formInputs(itemObj, user.courses, myGroup, user)}
      <div class="d-flex justify-content-end mb-3">
        <button type="button" class="btn btn-danger ${itemObj.id === '' ? 'd-none' : ''}" onclick="confirmDelete(this.form.name, \'/lessons/delete\')">${locale.buttons.delete[config.lang]}</button>
        <button type="button" class="btn btn-info ml-3" data-toggle="collapse" data-target="#lesson-form" onclick="javascript: $('#lesson-details').collapse('toggle');">${locale.buttons.cancle[config.lang]}</a>
        <button type="submit" class="btn btn-primary ml-3">${itemObj.id === '' ? locale.buttons.add[config.lang] : locale.buttons.update[config.lang]}</button>
      </div>
    </form>
  `;
}


// Additional functions

function formInputs (itemObj, courses, myGroup, user) {
  let returnHtml = '';
  if (Object.keys(itemObj).length > 0) {
    Object.keys(itemObj).forEach( key => {
      if (key !== 'id' && key !== 'lessonFinished' && key !== 'files' && key !== 'urlPath' && key !== 'group') {
        returnHtml += `<div class="form-group row mb-1 form-${key}">`;
        if (key === 'weekdays') {
          returnHtml += formCheckbox([[1,weekDay(1)],[2,weekDay(2)],[3,weekDay(3)],[4,weekDay(4)],[5,weekDay(5)],[6,weekDay(6)]], key, itemObj[key], []);
        } else if (key === 'lessonType') {
          returnHtml += formRadio('lessonType', ['homelesson', 'onlinelesson'], '', itemObj[key], '', 'onchange="changeAddLessonsFormView(this.value)"');
        } else if (key === 'time') {
          returnHtml += formSelect(lessonsConfig.lessonTimeslots, itemObj[key], 'time', 'onchange="checkAvailability(this.value)"', '', '');
          returnHtml += `<script>var onlinelessonsCalendar = ${JSON.stringify(loadFile(path.join(__dirname, '../../data/classes/', myGroup, 'onlinelessonscalendar.json')))};</script>`;
        } else if (key === 'lesson') {
          let coursOptions = lessonsConfig.courses.map( item => { return item.name; });
          if (!user.leader.includes(myGroup)) coursOptions = coursOptions.filter(item => courses.includes(item));
          returnHtml += formSelect(coursOptions, itemObj['lesson'], 'lesson', itemObj.id !== '' ? 'disabled' : '');
        } else if (key === 'returnHomework') {
          returnHtml += formRadio('returnHomework', [false, true], '', itemObj[key], '');
        } else if (key === 'startWeek') {
          returnHtml += formSelect(weeksArray(), itemObj[key], 'startWeek', 'onchange="calcValidFrom(this.value)"');
        } else if (key === 'weekAmount') {
          returnHtml += formRadio('weekAmount', ['1','2','3','4'], '', itemObj[key], '', 'onchange="calcValidUntil(this.value)"');
        } else if (key === 'details') {
          returnHtml += `
            <label for="${key}-field" class="col-sm-2 col-form-label text-right">${key}</label>
            <div class="col-sm-7">
              <textarea class="form-control" id="${key}-field" rows="3" name="${key}">${itemObj[key]}</textarea>
            </div>
          `;
        } else if (key === 'validFrom' || key === 'validUntil') {
          returnHtml += `
            <label for="${key}-field" class="col-sm-2 col-form-label text-right">${key}</label>
            <div class="col-sm-2">
              <input type="date" class="form-control" id="${key}-field" name="${key}" value="${itemObj[key]}" required readonly>
            </div>
          `;
        } else {
          returnHtml += `
            <label for="${key}-field" class="col-sm-2 col-form-label text-right">${key}</label>
            <div class="col-sm-7">
              <input type="text" class="form-control" id="${key}-field" name="${key}" value="${itemObj[key]}" ${key === 'chapter' ? 'required' : ''}>
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
