/*!
 * views/board/board-column.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getLessons } = require('../../models/model-lessons');
const { notValid } = require('../../lib/dateJuggler');
const boardCard = require('./board-card');
const boardCardForm = require('./board-card-form');
const boardColumnForm = require('./board-column-form');


function boardColumn (myTopic, myBoard, group, user) {
  let editor = false;
  if (user.role === 'teacher' && user.courses.includes(myTopic.autofillWith)) {
    editor = true;
  }
  if (user.role === 'teacher' && user.leader.includes(group)) {
    editor = true;
  }
  let cardsArray = [];
  if (myTopic.autofill === true) {
    cardsArray = getLessons(group).filter( item => item.lesson === myTopic.autofillWith && !notValid(item.validUntil));
  } else {
    cardsArray = myBoard.cards.filter( item => item.topicId === myTopic.id);
  }
  cardsArray = cardsArray.sort((a,b) => reorderLessonsByDateAsc(a,b));
  return `
    <div id="topic-${myTopic.id}" class="mr-3 board-topic ${editor === true ? 'ui-sortable-handle' : ''}">
      <h5 class="px-3 py-2 border mb-0 bg-light d-flex justify-content-between board-column">
        ${myTopic.topic}
        ${user.leader.includes(group) ? helperEditColumnButton(myTopic.id) : ''}
      </h5>
      ${editor === true ? boardColumnForm(group, myTopic) : ''}
      ${cardsArray.map( card => boardCard(card, myTopic, user.role, group)).join('')}
      ${editor === true && myTopic.autofill !== true ? boardCardForm(group, myTopic.id) : ''}
    </div>
  `;
}


// Additional functions

function helperEditColumnButton (topicId) {
  return `
    <a href="#" data-toggle="collapse" data-target="#addColumnForm-${topicId}">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-gear" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 0 1 4.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 0 1-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 0 1 1.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 0 1 2.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 0 1 2.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 0 1 1.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 0 1-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 0 1 8.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 0 0 1.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 0 0 .52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 0 0-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 0 0-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 0 0-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 0 0-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 0 0 .52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 0 0 1.255-.52l.094-.319z"/>
        <path fill-rule="evenodd" d="M8 5.754a2.246 2.246 0 1 0 0 4.492 2.246 2.246 0 0 0 0-4.492zM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0z"/>
      </svg>
    </a>
  `;
}

function reorderLessonsByDateAsc (lessonA, lessonB) {
  if ((lessonA.time === '' || lessonA.time === undefined) && lessonB.time > '') {
    return 1;
  } else if ((lessonB.time === '' || lessonB.time === undefined) && lessonA.time > '') {
    return -1;
  } else if (lessonA.time > lessonB.time) {
    return 1;
  } else if (lessonA.time < lessonB.time) {
    return -1;
  } else {
    return 0;
  }
}


module.exports = boardColumn;
