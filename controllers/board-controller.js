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


module.exports = { updateBoard };
