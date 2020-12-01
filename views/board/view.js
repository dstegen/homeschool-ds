/*!
 * views/board/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../models/model-config').getConfig();
const { getBoard } = require('../../models/model-board');
const boardColumn = require('./board-column');
const boardColumnForm = require('./board-column-form');


function boardView (group, role='student') {
  let myBoard = getBoard(group);
  if (myBoard.topics !== undefined) {
    return `
      <div class="board-bg">
        <div class="container p-3 d-flex justify-content-between">
          <h2>${locale.headlines.board[config.lang]} ${group}</h2>
        </div>
        <div id="board-frame" class="container px-0 pb-3 d-flex board-frame ${role === 'teacher' ? 'sortable ui-sortable' : ''}">
          ${myBoard.topics.map( topics => boardColumn(topics, myBoard, group, role)).join('')}
          ${role === 'teacher' ? boardColumnForm(group) : ''}
        </div>
      </div>
    `;
  } else {
    return `
      <div class="container p-3">
        <h4>No boards are defined for ${group}</h4>
      </div>
    `;
  }
}


module.exports = boardView;
