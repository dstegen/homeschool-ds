/*!
 * views/classroom/classroom-sockets.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';


function classroomSockets (wsport, group) {
  return `
    <script>
      // Websockets
      const hostname = window.location.hostname ;
      const wsProtocol = location.protocol.replace('http','ws');
      const socket = new WebSocket(wsProtocol+'//'+hostname+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
      socket.onmessage = function (msg) {
        //console.log(msg);
        if (msg.data === 'lessonclosed') {
          try {
            api.executeCommand('hangup');
          } catch (e) {
            //console.log(e);
          }
          window.location.replace('/');
        } else if (msg.data === 'updateclassroom') {
          location.reload();
        } else if (msg.data === 'newstudent') {
          $( "#studentsLeft" ).load(window.location.href + " #studentsLeft > *" );
          $( "#studentsRight" ).load(window.location.href + " #studentsRight > *" );
        } else if (msg.data === 'chatUpdate') {
          $("#chat-window-${group}").load(window.location.href + " #chat-window-${group} > *" );
          setTimeout(function () {
            $('#'+$('.chat-window')[0].id).scrollTop($('.chat-window')[0].scrollHeight);
          }, 500);
        } else if (msg.data === 'cleanchalkboard') {
          var bb = document.getElementById('studentChalkboard');
          if (bb !== null) bb.innerHTML = '';
        } else if (msg.data.toString().startsWith('[')) {
          signal(JSON.parse(msg.data)[1])
        } else {
          var bb = document.getElementById('studentChalkboard');
          if (bb !== null) bb.innerHTML = '<img class="img-fluid" src="'+msg.data+'" />';
          //$( "#studentChalkboard" ).load(window.location.href + " #studentChalkboard > *" );
        }
      };
    </script>
  `;
}


module.exports = classroomSockets;
