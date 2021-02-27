/*!
 * views/classroom/jitsi.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const serverconf = require('../../serverconf');


function jitsi (recentLesson, user) {
  return `
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
          disableTileView: false,
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
  `;
}


module.exports = jitsi;
