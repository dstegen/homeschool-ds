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
const { beforeFinishDate } = require('../lib/dateJuggler');


function boardView (group, role='student') {
  let myBoard = getBoard(group);
  let editButtons = '';
  let addColumn = '';
  if (myBoard.topics !== undefined) {
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
              <input type="text" class="form-control board-form form-control-sm" id="topic-field" name="topic" value="">
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
              ${myBoard.topics.map( topics => helperCreateColumn(topics, myBoard, group, role)).join('')}
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

function helperCreateColumn (myTopic, myBoard, group, role) {
  let cardsArray = [];
  if (myTopic.autofill === true) {
    cardsArray = getLessons(group).filter( item => item.lesson === myTopic.autofillWith && beforeFinishDate(item.validUntil));
  } else {
    cardsArray = myBoard.cards.filter( item => item.topicId === myTopic.id);
  }
  return `
    <div class="mr-3">
      <h5 class="px-3 py-2 border bg-light mt-3 d-flex justify-content-between" style="width: 200px; overflow: hidden;">
        ${myTopic.topic}
        ${role === 'teacher' ? helperEditColumnButton() : ''}
      </h5>
      ${cardsArray.map( card => helperCreateCards(card, myTopic, role)).join('')}
      ${role === 'teacher' && myTopic.autofill !== true ? helperAddCardForm(group, myTopic.id) : ''}
    </div>
  `;
}

function helperAddCardForm (group, myTopicId) {
  return `
    <div class="px-3 py-2 border text-muted bg-light text-center" style="width: 200px; overflow: hidden; cursor: pointer;" data-toggle="collapse" data-target="#addCardForm-${myTopicId}">
      <strong>+</strong>
    </div>
    <div id="addCardForm-${myTopicId}" class="collapse px-3 py-2 border bg-light">
      <form id="edit-column-form-${group}-${myTopicId}" name="edit-column-form-${group}-${myTopicId}" action="/board/${group}/update" method="post">
        <input type="text" name="group" class="d-none" hidden value="${group}" />
        <input type="text" name="topicId" class="d-none" hidden value="${myTopicId}" />
        <input type="text" name="section" class="d-none" hidden value="cards" />
        <label for="chapter-field">Chapter</label>
        <input type="text" class="form-control board-form form-control-sm mb-2" id="chapter-field" name="chapter" value="">
        <label for="details-field">Details</label>
        <textarea class="form-control form-control-sm" id="details-field" rows="3" name="details"></textarea>
        <hr />
        <label for="link-field">Link</label>
        <input type="text" class="form-control board-form form-control-sm" id="link-field" name="link" value="">
        <div class="d-flex justify-content-end mt-3">
          <button type="submit" class="btn btn-primary">${locale.buttons.add_update[config.lang]}</button>
        </div>
      </form>
    </div>
  `;
}

function helperCreateCards (card, myTopic, role) {
  let topicColor = myTopic.color;
  let returnHtml = '';
  let linkNFile = '';
  if (card.file && card.file != '') linkNFile += `<hr class="my-1" /><a class="small" href="${card.file}" target="_blank">Download</a>`;
  if (card.link && card.link != '') linkNFile += `<hr class="my-1" /><a class="small text-truncate" href="${card.link}" target="_blank">${card.link.split('//')[1]}</a>`;
  if (card.chapter >= '') {
      returnHtml += `
        <div class="border mb-2 bg-light" style="width: 200px; overflow: hidden;">
          <div class="py-2 px-3 h-100 w-100 d-flex justify-content-between ${topicColor}">
            <strong>${card.chapter}</strong>
            ${role === 'teacher' && myTopic.autofill !== true ? helperEditCardButton(topicColor) : ''}
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

function helperEditColumnButton () {
  return `
    <a href="#">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
      </svg>
    </a>
  `;
}

function helperEditCardButton (topicColor) {
  return `
    <a href="#" class="${topicColor}">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
      </svg>
    </a>
  `;
}

function helperSelects (optionsList, value, prop, disabled='') {
  return `
    <label for="${prop}-field" class="mt-2">${prop}</label>
    <select class="custom-select custom-select-sm" id="${prop}-field" name="${prop}" ${disabled}>
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
