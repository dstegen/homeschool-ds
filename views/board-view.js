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
const { notValid } = require('../lib/dateJuggler');


function boardView (group, role='student') {
  let myBoard = getBoard(group);
  if (myBoard.topics !== undefined) {
    return `
      <div style="background: url('/public/autumnleaves_light_ds.jpg');">
        <div class="container p-3 d-flex justify-content-between">
          <h2>${locale.headlines.board[config.lang]} ${group}</h2>
        </div>
        <div class="container px-0 pb-3 d-flex" style="overflow-x: scroll; min-height: 80vH;">
          ${myBoard.topics.map( topics => helperCreateColumn(topics, myBoard, group, role)).join('')}
          ${role === 'teacher' ? helperAddColumnForm(group) : ''}
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
    cardsArray = getLessons(group).filter( item => item.lesson === myTopic.autofillWith && !notValid(item.validUntil));
  } else {
    cardsArray = myBoard.cards.filter( item => item.topicId === myTopic.id);
  }
  return `
    <div class="mr-3">
      <h5 class="px-3 py-2 border mb-0 bg-light d-flex justify-content-between" style="width: 200px; overflow: hidden;">
        ${myTopic.topic}
        ${role === 'teacher' ? helperEditColumnButton(myTopic.id) : ''}
      </h5>
      ${role === 'teacher' ? helperAddColumnForm(group, myTopic) : ''}
      ${cardsArray.map( card => helperCreateCards(card, myTopic, role, group)).join('')}
      ${role === 'teacher' && myTopic.autofill !== true ? helperAddCardForm(group, myTopic.id) : ''}
    </div>
  `;
}

function helperAddColumnForm (group, myTopic) {
  let addButton = '';
  let delButton = `
    <button type="button" class="btn btn-danger" onclick="confirmDelete(this.form.name, '/board/${group}/delete')">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
    </button>
  `;
  if (myTopic === undefined) {
    myTopic = {
      id: 'null',
      order: '',
      topic: '',
      color: '',
      autofill: false,
      autofillWith: ''
    }
    addButton = `
      <div class="px-3 py-2 border bg-primary text-light text-center" style="width: 200px; overflow: hidden; cursor: pointer;" data-toggle="collapse" data-target="#addColumnForm-null">
        <strong>+ ${locale.buttons.add_column[config.lang]}</strong>
      </div>
    `;
    delButton = '';
  }
  return `
    <div>
      ${addButton}
      <div id="addColumnForm-${myTopic.id}" class="collapse px-3 py-2 border bg-light" style="width: 200px; overflow: hidden;">
        <form id="edit-column-form-${myTopic.id}" name="edit-column-form-${myTopic.id}" action="/board/${group}/update" method="post">
          <input type="text" name="id" class="d-none" hidden value="${myTopic.id}" />
          <input type="text" name="group" class="d-none" hidden value="${group}" />
          <input type="text" name="section" class="d-none" hidden value="topics" />
          <label for="topic-field">Title</label>
          <input type="text" class="form-control board-form form-control-sm" id="topic-field" name="topic" value="${myTopic.topic}">
          ${helperSelects(config.courseColors, myTopic.color, 'color', myTopic.autofill === true ? 'disabled' : '')}
          <div class="form-check form-check-inline mt-2">
            <label class="form-check-label" for="autofill">Autofill</label>
            <input class="form-check-input ml-2" type="checkbox" id="autofill" name="autofill" onchange="enableDisableInput(this, '#edit-column-form-${myTopic.id} select#with-field', '#edit-column-form-${myTopic.id} select#color-field')" ${myTopic.autofill === true ? 'checked' : ''}>
          </div>
          ${helperSelects(getGroupConfig(group).courses.map( item => { return item.name; }), myTopic.autofillWith, 'with', myTopic.autofill === true ? '' : 'disabled')}
          <div class="d-flex justify-content-between mt-3">
            ${delButton}
            <button type="submit" class="btn btn-primary">${myTopic.id === 'null' ? locale.buttons.add[config.lang] : locale.buttons.update[config.lang]}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function helperAddCardForm (group, myTopicId, myCard) {
  let addButton = '';
  let delButton = `
    <button type="button" class="btn btn-danger" onclick="confirmDelete(this.form.name, '/board/${group}/delete')">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
    </button>
  `;
  if (myCard === undefined) {
    myCard = {
      id: 'null',
      topicId: myTopicId,
      chapter: '',
      details: '',
      file: '',
      link: ''
    }
    delButton = '';
    addButton = `
      <div class="px-3 py-2 border mt-2 text-muted bg-light text-center" style="width: 200px; overflow: hidden; cursor: pointer;" data-toggle="collapse" data-target="#addCardForm-${myTopicId}-${myCard.id}">
        <strong>+</strong>
      </div>
    `;
  }
  return `
    ${addButton}
    <div id="addCardForm-${myTopicId}-${myCard.id}" class="collapse px-3 py-2 border bg-light" style="width: 200px; overflow: hidden;">
      <form id="edit-column-form-${group}-${myCard.id}" name="edit-column-form-${group}-${myCard.id}" action="/board/${group}/update" method="post">
        <input type="text" name="group" class="d-none" hidden value="${group}" />
        <input type="text" name="id" class="d-none" hidden value="${myCard.id}" />
        <input type="text" name="topicId" class="d-none" hidden value="${myCard.topicId}" />
        <input type="text" name="section" class="d-none" hidden value="cards" />
        <label for="chapter-field">Chapter</label>
        <input type="text" class="form-control board-form form-control-sm mb-2" id="chapter-field" name="chapter" value="${myCard.chapter}">
        <label for="details-field">Details</label>
        <textarea class="form-control form-control-sm" id="details-field" rows="3" name="details">${myCard.details}</textarea>
        <hr />
        <label for="link-field">Link</label>
        <input type="text" class="form-control board-form form-control-sm" id="link-field" name="link" value="${myCard.link}">
        <div class="d-flex justify-content-between mt-3">
          ${delButton}
          <button type="submit" class="btn btn-primary">${myCard.id === 'null' ? locale.buttons.add[config.lang] : locale.buttons.update[config.lang]}</button>
        </div>
      </form>
    </div>
  `;
}

function helperCreateCards (card, myTopic, role, group) {
  let topicColor = myTopic.color;
  if (myTopic.autofill == true) {
    topicColor = getGroupConfig(group).courses.filter( item => item.name === myTopic.autofillWith)[0].color;
  }
  let returnHtml = '';
  let linkNFile = '';
  if (card.files && card.files.length > 0) {
    linkNFile += `<hr class="my-1" />`;
    card.files.forEach( (file, i) => {
      linkNFile += `
        <a href="${file}" target="_blank">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path fill-rule="evenodd" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          <span class="small"> Download ${i+1}</span>
        </a><br />`
        ;
    });
  }
  if (card.link && card.link != '') {
    linkNFile += `
      <hr class="my-1" />
      <a text-truncate" href="${card.link}" target="_blank">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-link-45deg" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
        </svg>
        <span class="small">${card.link.split('//')[1]}
      </a>`;
  }
  if (card.chapter != '') {
      returnHtml += `
        <div class="border mt-2 bg-light" style="width: 200px; overflow: hidden;">
          <div class="py-2 px-3 h-100 w-100 d-flex justify-content-between ${topicColor}">
            <strong>${card.chapter}</strong>
            ${role === 'teacher' && myTopic.autofill !== true ? helperEditCardButton(myTopic, card.id) : ''}
            ${myTopic.autofill === true ? `<svg width="1em" height="1.5em" viewBox="0 0 16 16" class="bi bi-book" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M1 2.828v9.923c.918-.35 2.107-.692 3.287-.81 1.094-.111 2.278-.039 3.213.492V2.687c-.654-.689-1.782-.886-3.112-.752-1.234.124-2.503.523-3.388.893zm7.5-.141v9.746c.935-.53 2.12-.603 3.213-.493 1.18.12 2.37.461 3.287.811V2.828c-.885-.37-2.154-.769-3.388-.893-1.33-.134-2.458.063-3.112.752zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
</svg>` : ''}
          </div>
          ${helperAddCardForm(group, myTopic.id, card)}
          <div id="card-details-${card.id}" class="collapse show">
            <p class="small py-2 px-3">
              ${card.details}
            </p>
            <div class="py-2 px-3 text-truncate">
              ${linkNFile}
            </div>
          </div>
        </div>
      `;
  }
  return returnHtml;
}

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

function helperEditCardButton (myTopic, myCardId) {
  return `
    <a href="#" class="${myTopic.color}" data-toggle="collapse" data-target="#addCardForm-${myTopic.id}-${myCardId}" onclick="javascript: $('#card-details-${myCardId}').collapse('toggle')">
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
      <option value=""></option>
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
  if (value && value.includes(item)) selected = 'selected'
  return `
    <option ${selected} value="${myValue}">${item}</option>
  `;
}


module.exports = boardView;
