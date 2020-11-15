/*!
 * views/board-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const locale = require('../lib/locale');
const config = require('../models/model-config').getConfig();
const { getBoard } = require('../models/model-board');
let lessonsConfig = {};


function boardView (group) {
  lessonsConfig = require(path.join('../data/classes/', group,'/config.json'));
  let myBoard = getBoard(group);
  if (myBoard.topics !== undefined) {
    return `
      <div style="background: url('/public/autumnleaves_light_ds.jpg') no-repeat; background-size: cover; margin-bottom: -1rem;">
        <div class="container p-3">
          <h2>${locale.headlines.board[config.lang]} ${group}</h2>
        </div>
        <div class="container mb-3">
          <div class="d-flex" style="overflow-x: scroll;">
              ${myBoard.topics.map( topics => helperCreateColumn(topics, myBoard)).join('')}
          </div>
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


// Additional functions

function helperCreateColumn (myTopic, myBoard) {
  return `
    <div class="mr-3">
      <h5 class="px-3 py-2 border bg-light mt-3" style="width: 200px; overflow: hidden;">${myTopic.topic}</h5>
      ${myBoard.cards.filter( item => item.topicId === myTopic.id).map( card => helperCreateCards(card, myTopic.color)).join('')}
    </div>
  `;
}

function helperCreateCards (card, topicColor) {
  let returnHtml = '';
  let linkNFile = '';
  if (card.file != '') linkNFile += `<hr class="my-1" /><a class="small" href="${card.file}" target="_blank">Download</a>`;
  if (card.link != '') linkNFile += `<hr class="my-1" /><a class="small text-truncate" href="${card.link}" target="_blank">${card.link.split('//')[1]}</a>`;
  if (card.title >= '') {
      returnHtml += `
        <div class="border mb-2 bg-light" style="width: 200px; overflow: hidden;">
          <div class="py-2 px-3 h-100 w-100 ${topicColor}">
            <strong>${card.title}</strong>
          </div>
          <p class="small py-2 px-3">
            ${card.details}
          </p>
          <div class="py-2 px-3 text-truncate">
            ${linkNFile}
          </div>
        </div>
      `;
  }
  return returnHtml;
}


module.exports = boardView;
