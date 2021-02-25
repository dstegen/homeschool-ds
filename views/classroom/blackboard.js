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
const serverconf = require('../../serverconf');
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();


function blackboard (recentLesson, user) {
  let myChalkboard = '';
  if (user.role === 'teacher') {
    myChalkboard = `<canvas id="myBlackboard" class="${recentLesson.group}"></canvas>`;
  } else {
    if (fs.existsSync(path.join(__dirname, '../../data/classes/', recentLesson.group.toString(), 'onlinelesson.png'))) {
      myChalkboard = `<div id="studentChalkboard" style="width: 100%; max-width: 1110px; background: url('/data/classes/${recentLesson.group}/onlinelesson.png') center center; background-size: cover;"></div>`;
    } else {
      myChalkboard = `<div id="studentChalkboard" style="widht: 100%; max-width: 1110px; background: url('/public/blackboard.jpg') center center; background-size: cover;"></div>`;
    }
  }
  let tabMenu = '';
  let tabBody = '';
  if (recentLesson.options.includes('jitsi')) {
    tabMenu += `
      <li class="nav-item" role="presentation">
        <a class="nav-link active" id="jitsi-tab" data-toggle="tab" href="#jitsi" role="tab" aria-controls="jitsi" aria-selected="true">Jitsi</a>
      </li>
    `;
    tabBody += `
      <div class="tab-pane fade show active border border-top-0" id="jitsi" role="tabpanel" aria-labelledby="jitsi-tab">
        <script src='https://${serverconf.meetServer}/external_api.js'></script>
        <script>
          const options = {
            roomName: '${recentLesson.group}',
            width: '1110px',
            height: '625px',
            parentNode: document.querySelector('#jitsi'),
            configOverwrite: {
              startWithAudioMuted: true,
              enableWelcomePage: false,
              enableClosePage: false,
              disableTileView: true,
              hideConferenceTimer: true
            },
            interfaceConfigOverwrite: {
              DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              DISABLE_PRESENCE_STATUS: true,
              HIDE_INVITE_MORE_HEADER: true,
              RECENT_LIST_ENABLED: true,
              SETTINGS_SECTIONS: [ 'devices' ],
              SHOW_JITSI_WATERMARK: true,
              TOOLBAR_BUTTONS: [
                  'microphone', 'camera', 'desktop', 'fullscreen',
                  'fodeviceselection', 'profile', 'chat',
                  'etherpad', 'sharedvideo', 'settings', 'raisehand',
                  'videoquality', 'filmstrip', 'shortcuts',
                  'tileview', 'videobackgroundblur', 'help', 'mute-everyone', 'mute-video-everyone', 'security'
              ],
              VIDEO_QUALITY_LABEL_DISABLED: true
            },
            userInfo: {
                displayName: '${user.fname + ' ' + user.lname}'
            }
          }
          const api = new JitsiMeetExternalAPI('${serverconf.meetServer}', options);
          // set new password for channel
          api.addEventListener('participantRoleChanged', function(event) {
              if (event.role === "moderator") {
                  api.executeCommand('password', '${recentLesson.key}');
              }
          });
          // join a protected channel
          api.on('passwordRequired', function ()
          {
              api.executeCommand('password', '${recentLesson.key}');
          });
          // enable lobby
          api.addEventListener('participantRoleChanged', function (event) {
              if(event.role === 'moderator') {
                  api.executeCommand('toggleLobby', false);
              }
          });
        </script>
      </div>
    `;
  }
  if (recentLesson.options.includes('chalkboard')) {
    tabMenu += `
      <li class="nav-item" role="presentation">
        <a class="nav-link ${recentLesson.options.includes('jitsi') ? '' : 'active'}" id="chalkboard-tab" data-toggle="tab" href="#chalkboard" role="tab" aria-controls="chalkboard" aria-selected="false">${locale.headlines.blackboard_chalkboard[config.lang]}</a>
      </li>
    `;
    tabBody += `
      <div class="tab-pane fade ${recentLesson.options.includes('jitsi') ? '' : 'show active'} border border-top-0" id="chalkboard" role="tabpanel" aria-labelledby="chalkboard-tab">
        ${myChalkboard}
      </div>
    `;
  }
  if (recentLesson.options.includes('docs')) {
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
  }
  if (recentLesson.options.includes('youtube')) {
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
  }
  return `
  <ul class="nav nav-tabs" id="blackboardTab" role="tablist">
    ${tabMenu}
  </ul>
  <div class="tab-content mb-3" id="myTabContent">
    ${tabBody}
  </div>
  `;
}


module.exports = blackboard;
