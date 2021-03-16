/*!
 * views/lessons/returned-homework-overview.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { dateIsRecent } = require('../../lib/dateJuggler');
const { getTitleNameById } = require('../../user/models/model-user');
const { returnedHomework } = require('../../models/model-lessons');
const simpleList = require('../templates/simple-list');


function returnedHomeworkOverview (user) {
  let returnHtml = '';
  user.group.forEach( group => {
    try {
      let recentHomeworkList = returnedHomework(group, user.courses, user).filter( item => dateIsRecent(item.birthtime, 5));
      if (recentHomeworkList.length > 0) {
        returnHtml += simpleList(locale.headlines.class[config.lang]+' '+group, recentHomeworkList.map( item => { return `<a href="/lessons/show/${group}/${item.lessonId}" class="orange">${item.course} (${item.lessonId})</a> : <a href="${item.files[0]}" class="orange" target="_blank">${item.files[0].split('/').pop()} (${getTitleNameById(item.studentId)})</a>`}));
      }
    } catch (e) {
      console.log('- ERROR getting lates returned homeworks: '+e);
    }
  });
  return returnHtml;
}


module.exports = returnedHomeworkOverview;
