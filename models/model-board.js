/*!
 * models/model-boards.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');


function getBoard (group) {
  let returnBoard = {};
  try {
    returnBoard = loadFile(path.join(__dirname, '../data/classes', group, 'board.json'), false);
    return returnBoard;
  } catch (e) {
    console.log('- ERROR reading board file: '+e);
    return {};
  }
}

function updateTopic (fields) {
  let tmpBoard = getBoard(fields.group);
  let newCard = {
    "id": getNewId(tmpBoard.topics),
    "order": getNewId(tmpBoard.topics),
    "topic": fields.topic,
    "color": fields.color,
    "autofill": fields.autofill === 'on' ? true : false,
    "autofillWith": fields.with
  }
  try {
    tmpBoard.topics.push(newCard);
    saveFile(path.join(__dirname, '../data/classes', fields.group), 'board.json', tmpBoard);
  } catch (e) {
    console.log('- ERROR updating/saving board: '+e);
  }
}

function updateCard (fields) {
  let tmpBoard = getBoard(fields.group);
  let newCard = {
    "id": getNewId(tmpBoard.cards),
    "topicId": Number(fields.topicId),
    "chapter": fields.chapter,
    "details": fields.details,
    "link": fields.link
  }
  try {
    tmpBoard.cards.push(newCard);
    saveFile(path.join(__dirname, '../data/classes', fields.group), 'board.json', tmpBoard);
  } catch (e) {
    console.log('- ERROR updating/saving board: '+e);
  }
}


// Additional functions

function getNewId (cards) {
  return Math.max(...cards.map( item => item.id)) + 1;
}


module.exports = { getBoard, updateCard, updateTopic };
