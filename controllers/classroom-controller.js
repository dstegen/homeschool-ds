/*!
 * controllers/classroomView-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const getNaviObj = require('../views/lib/getNaviObj');
const classroomView = require('../views/classroom/view');
const view = require('../views/view');

let myGroup = '';


function classroomController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (user.role === 'student') {
    myGroup = user.group;
    uniSend(view('', naviObj, classroomView(myGroup, user, wss, wsport)), response);
  } else if (user.role === 'teacher') {
    if (route.startsWith('classroom') && route.includes('update')) {
      updateClassroom(request, response, wss, wsport, user);
    } else if (route.startsWith('classroom')) {
      myGroup = route.split('/')[1];
      uniSend(view('', naviObj, classroomView(myGroup, user, wss, wsport)), response);
    }
  } else {
    uniSend(new SendObj(302), response);
  }
}


// Additional functions

function updateClassroom (request, response, wss, wsport, user) {
  getFormObj(request).then(
    data => {
      if (request.url.includes('update')) {
        console.log(data.fields);
        wss.clients.forEach(client => {
          setTimeout(function () {
            client.send(data.fields.ctx);
          }, 100);
        });
      }
      //uniSend(new SendObj(302, [], '', '/classroom/'+request.url.substr(1).split('?')[0].split('/')[1]), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update classroom: '+error.message);
  });
}


module.exports = classroomController;
