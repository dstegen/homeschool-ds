/*!
 * views/lessons/lesson-form.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getGroupConfig } = require('../../models/model-config');
const { isActualWeek, dayFromWeek } = require('../../lib/dateJuggler');
const getIcon = require('../lib/get-icon');


function lessonSmall (lessonObj, curDay, curWeek, myGroup) {
  let lessonsConfig = getGroupConfig(myGroup);
  let lessonColor = '';
  let lessonLink = `/lessons/day/${dayFromWeek(curDay, curWeek)}/${myGroup}/${lessonObj.id}`;
  if (lessonObj.lessonType === 'onlinelesson') lessonLink = '/classroom/'+myGroup;
  if (lessonsConfig.courses.filter( item => item.name === lessonObj.lesson).length > 0) {
    lessonColor = lessonsConfig.courses.filter( item => item.name === lessonObj.lesson)[0].color;
  }

  if (lessonObj.weekdays.includes(curDay) && isActualWeek(lessonObj.validFrom, lessonObj.validUntil, curWeek)) {
    return `
      <div class="card lesson ${lessonColor} mt-2 text-left">
        <div id="lesson-${lessonObj.id}${curDay}" class="card-header px-2 py-1 text-truncate" onclick="$('#lesson-details-${lessonObj.id}${curDay}').collapse('toggle');">
          <div class="d-flex justify-content-between font-weight-bold">
            <span>${lessonObj.lesson}:</span>
            <span class="mb-0">${getIcon(lessonObj.lessonType)}</span>
          </div>
          ${lessonObj.lessonType === 'onlinelesson' ? lessonObj.time + ': ' : ''}
          ${lessonObj.chapter}
        </div>
        <div id="lesson-details-${lessonObj.id}${curDay}" class="card-body collapse px-2 py-1" data-parent="#week">
          <p class="card-text mb-0">${lessonObj.details}</p>
          <p class="text-right mb-1">
            <a class="${lessonColor}" href="${lessonLink}">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-up-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
            </a>
          </p>
        </div>
      </div>
    `;
  } else {
    return '';
  }
}


module.exports = lessonSmall;
