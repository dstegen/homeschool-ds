/*!
 * models/model-boards.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const fs = require('fs');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');


function getBoard (group) {
  let returnBoard = {};
  returnBoard = loadFile(path.join(__dirname, '../data/classes', group, 'board.json'), false);
  if (returnBoard.topics !== undefined) {
    return returnBoard;
  } else {
    return {
      topics: [
        {
          id: 0,
          order: 0,
          topic: 'Info',
          color: 'bg-blue',
          autofill: false
        }
      ],
      cards: [
        {
          id: 0,
          topicId: 0,
          chapter: 'Start your board',
          details: 'Start adding content and lessons to your board!',
          link: ''
        }
      ]
    };
  }
}

function updateTopic (fields) {
  let tmpBoard = getBoard(fields.group);
  let newTopic = {};
  if (fields.id !== 'null' && tmpBoard.topics.filter( item => item.id === Number(fields.id) ).length === 1) {
    newTopic = tmpBoard.topics.filter( item => item.id === Number(fields.id) )[0];
  } else {
    newTopic.id = getNewId(tmpBoard.topics);
    newTopic.order = newTopic.id;
  }
  newTopic.topic = fields.topic,
  newTopic.color = fields.color,
  newTopic.autofill = fields.autofill === 'on' ? true : false,
  newTopic.autofillWith = fields.with
  try {
    if (fields.id === 'null') {
      tmpBoard.topics.push(newTopic);
    }
    saveFile(path.join(__dirname, '../data/classes', fields.group), 'board.json', tmpBoard);
  } catch (e) {
    console.log('- ERROR updating/saving board: '+e);
  }
}

function updateCard (fields, files) {
  let tmpBoard = getBoard(fields.group);
  let newCard = {};
  if (fields.id !== 'null' && tmpBoard.cards.filter( item => item.id === Number(fields.id) ).length === 1) {
    newCard = tmpBoard.cards.filter( item => item.id === Number(fields.id) )[0];
  } else {
    newCard.id = getNewId(tmpBoard.cards);
  }
  newCard.topicId = Number(fields.topicId);
  newCard.chapter = fields.chapter;
  newCard.details = fields.details;
  newCard.link = fields.link;
  if (files.filetoupload.name !== '') {
    if (newCard.files === undefined || newCard.files === '') newCard.files = [];
    newCard.files.push(fileUpload(fields, files));
  }
  try {
    if (fields.id === 'null') {
      tmpBoard.cards.push(newCard);
    }
    //console.log(tmpBoard.cards);
    saveFile(path.join(__dirname, '../data/classes', fields.group), 'board.json', tmpBoard);
  } catch (e) {
    console.log('- ERROR updating/saving board: '+e);
  }
}

function deleteFromBoard (fields) {
  let tmpBoard = getBoard(fields.group);
  if (fields.section === 'topics') {
    tmpBoard.topics.splice(tmpBoard.topics.indexOf(tmpBoard.topics.filter( item => item.id === Number(fields.id) )[0]), 1);
    if (tmpBoard.cards.filter( item => item.topicId === Number(fields.id) ).length > 0) {
      tmpBoard.cards.filter( item => item.topicId === Number(fields.id) ).forEach( item => {
        tmpBoard.cards.splice(tmpBoard.cards.indexOf(item), 1);
      });
    }
  } else if (fields.section === 'cards') {
    tmpBoard.cards.splice(tmpBoard.cards.indexOf(tmpBoard.cards.filter( item => item.id === Number(fields.id) )[0]), 1);
  }
  try {
    saveFile(path.join(__dirname, '../data/classes', fields.group), 'board.json', tmpBoard);
  } catch (e) {
    console.log('- ERROR saving board after deletion: '+e);
  }
}

function deleteFileFromCard (fields) {
  let tmpBoard = getBoard(fields.group);
  let myFiles = tmpBoard.cards.filter( item => item.id === Number(fields.id))[0].files;
  myFiles.splice(myFiles.indexOf('/data/classes/'+fields.group+'/board/'+fields.id+'/'+fields.delfilename));
  tmpBoard.cards.filter( item => item.id === Number(fields.id))[0].files = myFiles;
  try {
    saveFile(path.join(__dirname, '../data/classes', fields.group), 'board.json', tmpBoard);
  } catch (e) {
    console.log('- ERROR saving board after deletion of file: '+e);
  }
}


// Additional functions

function getNewId (cards) {
  return Math.max(...cards.map( item => item.id)) + 1;
}

function fileUpload (fields, files) {
  console.log('+ Upload file: '+files.filetoupload.name);
  let oldpath = files.filetoupload.path;
  if (!fs.existsSync(path.join(__dirname, '../data/classes', fields.group, 'board', fields.id))) {
    fs.mkdirSync(path.join(__dirname, '../data/classes', fields.group, 'board', fields.id), { recursive: true });
  }
  let newpath = path.join(__dirname, '../data/classes', fields.group, 'board', fields.id, files.filetoupload.name);
  try {
    fs.renameSync(oldpath, newpath);
    fs.chmodSync(newpath, '0640');
    console.log('+ Saved successfully file: '+newpath);
    return path.join('/data/classes', fields.group, 'board', fields.id, files.filetoupload.name);
  } catch (e) {
    console.log('- ERROR file upload, saving+changing file: ' + e);
    return '';
  }
}

module.exports = { getBoard, updateCard, updateTopic, deleteFromBoard, deleteFileFromCard };
