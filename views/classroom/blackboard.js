/*!
 * views/classroom/blackboard.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const jitsi = require('./jitsi');


function blackboard (recentLesson, user) {
  let tabMenu = '';
  let tabBody = '';
  let activeTab = false;
  for (let i=0; i<recentLesson.options.length; i++) {
    if (recentLesson.options[i] === 'jitsi' || recentLesson.options[i] === 'chalkboard') {
      if (recentLesson.options[i] === 'jitsi') activeTab = true;
      if (recentLesson.options[i] === 'chalkboard' && !recentLesson.options.includes('jitsi')) activeTab = true;
      tabMenu += `
        <li class="nav-item" role="presentation">
          <a class="nav-link ${activeTab === true ? 'active' : ''} text-capitalize" id="${recentLesson.options[i]}-tab" data-toggle="tab" href="#${recentLesson.options[i]}" role="tab" aria-controls="${recentLesson.options[i]}" aria-selected="${activeTab === true ? 'true' : ''}">${locale.headlines[recentLesson.options[i]][config.lang]}</a>
        </li>
      `;
      tabBody += `
        <div class="tab-pane fade ${activeTab === true ? 'show active' : ''} border border-top-0" id="${recentLesson.options[i]}" role="tabpanel" aria-labelledby="${recentLesson.options[i]}-tab">
          ${recentLesson.options[i] === 'jitsi' ? jitsi(recentLesson, user) : chalkBoard(recentLesson, user)}
        </div>
      `;
      activeTab = false;
    }
  }
  if (recentLesson.options.includes('docs')) {
    for (let i=0; i<recentLesson.docs.length; i++) {
      tabMenu += `
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="docs-tab-${i}" data-toggle="tab" href="#docs${i}" role="tab" aria-controls="docs${i}" aria-selected="false">${locale.headlines.docs[config.lang]} ${i+1}</a>
        </li>
      `;
      tabBody += `
        <div class="tab-pane fade border border-top-0" id="docs${i}" role="tabpanel" aria-labelledby="docs-tab-${i}" style="width: 1110px; height: 625px;">
          <iframe src = "/node_modules/node-viewerjs/release/index.html?zoom=page-width#${recentLesson.docs[i]}" width='1110' height='625' allowfullscreen webkitallowfullscreen></iframe>
        </div>
      `;
    }
  }
  if (recentLesson.options.includes('youtube')) {
    for (let i=0; i<recentLesson.youtube.length; i++) {
      tabMenu += `
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="video-tab-${i}" data-toggle="tab" href="#video${i}" role="tab" aria-controls="video${i}" aria-selected="false">${locale.headlines.youtube[config.lang]} ${i+1}</a>
        </li>
      `;
      tabBody += `
      <div class="tab-pane fade border border-top-0" id="video${i}" role="tabpanel" aria-labelledby="video-tab-${i}" style="width: 1110px; height: 625px;">
        <iframe width="1110" height="625" src="https://www.youtube-nocookie.com/embed/${recentLesson.youtube[i]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      `;
    }
  }
  return `
    ${actionsButtons(recentLesson, user)}
    <ul class="nav nav-tabs" id="blackboardTab" role="tablist">
      ${tabMenu}
    </ul>
    <div class="tab-content mb-3" id="myTabContent">
      ${tabBody}
    </div>
  `;
}


// Additional functions

function actionsButtons (recentLesson, user) {
  if (user.role === 'teacher' && !recentLesson.options.includes('jitsi')) {
    return `
      <div class="mt-3 d-flex justify-content-end">
        <button class="btn btn-sm btn-primary" onclick="cleanChalkboard('${recentLesson.group}');">Clean chalkboard</button>
        <button class="btn btn-sm btn-primary ml-3" onclick="window.location.replace('/classroom/${recentLesson.group}/update');">Update classroom</button>
        <button class="btn btn-sm btn-danger ml-3" onclick="closeClassroom('${recentLesson.group}');">${locale.buttons.end_onelinelesson[config.lang]}</button>
      </div>
    `;
  } else if (user.role === 'teacher') {
    return `
      <div class="mt-3 d-flex justify-content-end">
        <button class="btn btn-sm btn-danger ml-3" onclick="closeClassroom('${recentLesson.group}');">${locale.buttons.end_onelinelesson[config.lang]}</button>
      </div>
    `;
  } else {
    return `
    <div class="mt-3 d-flex justify-content-end">
      <button class="btn btn-warning" onclick="signalTeacher('${recentLesson.group}','${user.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-index" viewBox="0 0 16 16">
          <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435a4.9 4.9 0 0 1 .106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 0 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z"/>
        </svg>
      </button>
      <button class="btn btn-danger ml-3" onclick="exitClassroom();">Exit</button>
    </div>
    `;
  }
}

function chalkBoard (recentLesson, user) {
  if (user.role === 'teacher') {
    return `<canvas id="myBlackboard" class="${recentLesson.group}" style="background: url('${recentLesson.chalkboardBg}') center center; background-size: cover;"></canvas>`;
  } else {
    if (fs.existsSync(path.join(__dirname, '../../data/classes/', recentLesson.group.toString(), 'onlinelesson.png'))) {
      return `<div id="studentChalkboard" style="width: 100%; max-width: 1110px; background: url('${recentLesson.chalkboardBg}') center center; background-size: cover;">
        <img class="img-fluid" src="/data/classes/${recentLesson.group}/onlinelesson.png">
      </div>`;
    } else {
      return `<div id="studentChalkboard" style="widht: 100%; max-width: 1110px; background: url('${recentLesson.chalkboardBg}') center center; background-size: cover;"></div>`;
    }
  }
}

function docsTab (filePath) {
  if (filePath !== '') {
    return `<iframe src = "/node_modules/node-viewerjs/release/index.html?zoom=page-width#${filePath}" width='1110' height='625' allowfullscreen webkitallowfullscreen></iframe>`;
  } else {
    return '';
  }
}

function youtubeTab (youtubeId) {
  if (youtubeId !== '') {
    return `<iframe width="1110" height="625" src="https://www.youtube-nocookie.com/embed/${youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else {
    return '';
  }
}


module.exports = blackboard;
