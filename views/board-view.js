/*!
 * views/board-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../lib/locale');
const { getGroupConfig, getConfig } = require('../models/model-config');
const config = getConfig();
const { getBoard } = require('../models/model-board');
const { getLessons } = require('../models/model-lessons');


function boardView (group, role='student') {
  let myBoard = getBoard(group);
  if (myBoard.topics !== undefined) {
    let editButtons = '';
    let addColumn = '';
    let addCard = '';
    if (role === 'teacher') {
      editButtons = `
      <div class="d-flex align-items-center">
        <a href="/board/${group}/settings" class="btn btn-sm bg-grey ml-3">Settings</a>
        <a href="/board/${group}/edit" class="btn btn-sm btn-secondary ml-3">Edit</a>
      </div>
      `;
      addColumn = `
        <div class="mr-3">
          <div class="px-3 py-2 border bg-primary text-light text-center mt-3" style="width: 200px; overflow: hidden; cursor: pointer;" data-toggle="collapse" data-target="#addColumnForm">
            <strong>+ add column</strong>
          </div>
          <div id="addColumnForm" class="collapse px-3 py-2 border bg-light">
            <form id="edit-column-form-${group}" name="edit-column-form-${group}" action="/board/${group}/update" method="post">
              <input type="text" name="group" class="d-none" hidden value="${group}" />
              <input type="text" name="section" class="d-none" hidden value="topics" />
              <label for="topic-field">Title</label>
              <input type="text" class="form-control form-control-sm" id="topic-field" name="topic" value="">
              ${helperSelects(config.courseColors, '', 'color')}
              <div class="form-check form-check-inline mt-2">
                <label class="form-check-label" for="autofill">Autofill</label>
                <input class="form-check-input ml-2" type="checkbox" id="autofill" name="autofill" onchange="enableDisableInput(this, '#with-field')">
              </div>
              ${helperSelects(getGroupConfig(group).courses.map( item => { return item.name; }), '', 'with', 'disabled')}
              <div class="d-flex justify-content-end mt-3">
                <button type="submit" class="btn btn-primary">${locale.buttons.add_update[config.lang]}</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
    return `
      <div style="background: url('/public/autumnleaves_light_ds.jpg') no-repeat; background-size: cover; margin-bottom: -1rem;">
        <div class="container p-3 d-flex justify-content-between">
          <h2>${locale.headlines.board[config.lang]} ${group}</h2>
          ${editButtons}
        </div>
        <div class="container mb-3">
          <div class="d-flex" style="overflow-x: scroll;">
              ${myBoard.topics.map( topics => helperCreateColumn(topics, myBoard, group)).join('')}
              ${addColumn}
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

function helperCreateColumn (myTopic, myBoard, group) {
  let cardsArray = [];
  if (myTopic.autofill === true) {
    cardsArray = getLessons(group).filter( item => item.lesson === myTopic.autofillWith);
  } else {
    cardsArray = myBoard.cards.filter( item => item.topicId === myTopic.id);
  }
  return `
    <div class="mr-3">
      <h5 class="px-3 py-2 border bg-light mt-3" style="width: 200px; overflow: hidden;">${myTopic.topic}</h5>
      ${cardsArray.map( card => helperCreateCards(card, myTopic.color)).join('')}
    </div>
  `;
}

function helperCreateCards (card, topicColor) {
  let returnHtml = '';
  let linkNFile = '';
  if (card.file && card.file != '') linkNFile += `<hr class="my-1" /><a class="small" href="${card.file}" target="_blank">Download</a>`;
  if (card.link && card.link != '') linkNFile += `<hr class="my-1" /><a class="small text-truncate" href="${card.link}" target="_blank">${card.link.split('//')[1]}</a>`;
  if (card.chapter >= '') {
      returnHtml += `
        <div class="border mb-2 bg-light" style="width: 200px; overflow: hidden;">
          <div class="py-2 px-3 h-100 w-100 ${topicColor}">
            <strong>${card.chapter}</strong>
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

function helperSelects (optionsList, value, prop, disabled='') {
  return `
    <label for="${prop}-field" class="mt-2">${prop}</label>
    <select class="form-control form-control-sm" id="${prop}-field" name="${prop}" ${disabled}>
      <option value="" selected></option>
      ${optionsList.map( item => helperSelectOption(item, value) ).join('')}
    </select>
  `;
}

function helperSelectOption (item, value) {
  let myValue = item;
  if (typeof(item) === 'object') {
    myValue = item[0];
    item = item[1];
  }
  let selected = '';
  if (value.includes(item)) selected = 'selected'
  return `
    <option ${selected} value="${myValue}">${item}</option>
  `;
}


module.exports = boardView;
