/*!
 * controllers/board-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { updateTopic, updateCard, deleteFromBoard } = require('../models/model-board');
const getNaviObj = require('../views/lib/getNaviObj');
const boardView = require('../views/board/view');
const view = require('../views/view');

let myGroup = '';


function boardController (request, response, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (user.role === 'student') {
    myGroup = user.group;
    uniSend(view('', naviObj, boardView(myGroup)), response);
  } else if (user.role === 'teacher') {
    if (route.startsWith('board') && (route.includes('update') || route.includes('delete'))) {
      updateBoard(request, response);
    } else if (route.startsWith('board')) {
      myGroup = route.split('/')[1];
      uniSend(view('', naviObj, boardView(myGroup, 'teacher')), response);
    }
  } else {
    uniSend(new SendObj(302), response);
  }
}


// Additional functions

function updateBoard (request, response) {
  getFormObj(request).then(
    data => {
      if (request.url.includes('delete')) {
        deleteFromBoard(data.fields);
      } else if (data.fields.section === 'topics') {
        updateTopic(data.fields);
      } else if (data.fields.section === 'cards') {
        updateCard(data.fields, data.files);
      }
      uniSend(new SendObj(302, [], '', '/board/'+request.url.substr(1).split('?')[0].split('/')[1]), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update board: '+error.message);
  });
}


module.exports = boardController;
