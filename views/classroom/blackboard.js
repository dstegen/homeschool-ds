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


function blackboard (role) {
  let myChalkboard = '';
  if (role === 'teacher') {
    myChalkboard = `<canvas id="myBlackboard" width="1110" height="625" style="width: 1110px; height: 625px;"></canvas>`;
  } else {
    myChalkboard = `<div id="studentChalkboard" style="width: 1110px; height: 625px; background: url('/public/blackboard.jpg') center center;"></div>`;
  }
  return `
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <a class="nav-link active" id="chalkboard-tab" data-toggle="tab" href="#chalkboard" role="tab" aria-controls="chalkboard" aria-selected="true">Chalkboard</a>
    </li>
    <li class="nav-item" role="presentation">
      <a class="nav-link" id="docs-tab" data-toggle="tab" href="#docs" role="tab" aria-controls="docs" aria-selected="false">Docs</a>
    </li>
    <li class="nav-item" role="presentation">
      <a class="nav-link" id="video-tab" data-toggle="tab" href="#video" role="tab" aria-controls="video" aria-selected="false">Video</a>
    </li>
  </ul>
  <div class="tab-content mb-3" id="myTabContent">
    <div class="tab-pane fade show active border border-top-0" id="chalkboard" role="tabpanel" aria-labelledby="chalkboard-tab">
      ${myChalkboard}
    </div>
    <div class="tab-pane fade border border-top-0" id="docs" role="tabpanel" aria-labelledby="docs-tab" style="width: 1110px; height: 625px;">
      <iframe src = "/node_modules/node-viewerjs/release/index.html?zoom=page-width#/data/classes/7A1/courses/Mathe/700015/homework/100001/ds_aufgaben_mathe.pdf" width='1110' height='625' allowfullscreen webkitallowfullscreen></iframe>
    </div>
    <div class="tab-pane fade border border-top-0" id="video" role="tabpanel" aria-labelledby="video-tab" style="width: 1110px; height: 625px;">
      <iframe width="1110" height="625" src="https://www.youtube-nocookie.com/embed/ksCrRr6NBg0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  </div>
  `;
}


module.exports = blackboard;
