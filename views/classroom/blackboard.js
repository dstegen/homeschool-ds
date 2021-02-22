/*!
 * views/classroom/blackboard.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();


function blackboard (recentLesson, role) {
  let myChalkboard = '';
  if (role === 'teacher') {
    myChalkboard = `<canvas id="myBlackboard" class="${recentLesson.group}" width="1110" height="625" style="width: 1110px; height: 625px;"></canvas>`;
  } else {
    if (fs.existsSync(path.join(__dirname, '../../data/classes/', recentLesson.group.toString(), 'onlinelesson.png'))) {
      myChalkboard = `<div id="studentChalkboard" style="width: 1110px; height: 625px; background: url('/data/classes/${recentLesson.group}/onlinelesson.png') center center;"></div>`;
    } else {
      myChalkboard = `<div id="studentChalkboard" style="width: 1110px; height: 625px; background: url('/public/blackboard.jpg') center center;"></div>`;
    }
  }
  let tabMenu = '';
  let tabBody = '';
  for (let i=0; i<recentLesson.files.length; i++) {
    tabMenu += `
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="docs-tab-${i}" data-toggle="tab" href="#docs${i}" role="tab" aria-controls="docs${i}" aria-selected="false">${locale.headlines.blackboard_doc[config.lang]} ${i+1}</a>
      </li>
    `;
    tabBody += `
      <div class="tab-pane fade border border-top-0" id="docs${i}" role="tabpanel" aria-labelledby="docs-tab-${i}" style="width: 1110px; height: 625px;">
        <iframe src = "/node_modules/node-viewerjs/release/index.html?zoom=page-width#${recentLesson.files[i]}" width='1110' height='625' allowfullscreen webkitallowfullscreen></iframe>
      </div>
    `;
  }
  for (let i=0; i<recentLesson.videos.length; i++) {
    tabMenu += `
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="video-tab-${i}" data-toggle="tab" href="#video${i}" role="tab" aria-controls="video${i}" aria-selected="false">${locale.headlines.blackboard_video[config.lang]} ${i+1}</a>
      </li>
    `;
    tabBody += `
    <div class="tab-pane fade border border-top-0" id="video${i}" role="tabpanel" aria-labelledby="video-tab-${i}" style="width: 1110px; height: 625px;">
      <iframe width="1110" height="625" src="https://www.youtube-nocookie.com/embed/${recentLesson.videos[i]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    `;
  }
  return `
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <a class="nav-link active" id="chalkboard-tab" data-toggle="tab" href="#chalkboard" role="tab" aria-controls="chalkboard" aria-selected="true">${locale.headlines.blackboard_chalkboard[config.lang]}</a>
    </li>
    ${tabMenu}
  </ul>
  <div class="tab-content mb-3" id="myTabContent">
    <div class="tab-pane fade show active border border-top-0" id="chalkboard" role="tabpanel" aria-labelledby="chalkboard-tab">
      ${myChalkboard}
    </div>
    ${tabBody}
  </div>
  `;
}


module.exports = blackboard;
