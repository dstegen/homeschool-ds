/*!
 * controllers/lessons-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { getLessons, updateLesson, deleteLesson, finishLesson } = require('../models/model-lessons');
const getNaviObj = require('../views/lib/getNaviObj');
const teacherLessonsEditView = require('../views/teacher/edit-lesson-view');
const view = require('../views/view');


function editLessonAction (request, response, user) {
  let itemObj = {};
  if (request.url.split('/')[2] != undefined) {
    let myGroup = request.url.split('/')[2];
    let myLessons = getLessons(myGroup);
    if (request.url.split('/')[3] != undefined && Number.isInteger(Number(request.url.split('/')[3]))) {
      itemObj = myLessons.filter( item => item.id === Number(request.url.split('/')[3]))[0];
    } else {
      Object.keys(myLessons[0]).forEach( key => {
        itemObj[key] = '';
      });
    }
    uniSend(view('', getNaviObj(user), teacherLessonsEditView(itemObj, myGroup, user)),response);
  } else {
    uniSend(new SendObj(302), response);
  }
}

function updateLessonAction (request, response) {
  getFormObj(request).then(
    data => {
      updateLesson(data.fields);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update/add: '+error.message);
  });
  uniSend(new SendObj(302, [], '', '/teacher/lessons'), response);
}

function deleteLessonAction (request, response) {
    getFormObj(request).then(
      data => {
        deleteLesson(data.fields);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t delete item: '+error.message);
    });
    uniSend(new SendObj(302, [], '', '/teacher/lessons'), response);
}

function finishLessonAction (request, response) {
  getFormObj(request).then(
    data => {
      finishLesson(data.fields);
      uniSend(new SendObj(302, [], '', data.fields.urlPath), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t finish lesson: '+error.message);
  });
}


module.exports = { editLessonAction, updateLessonAction, deleteLessonAction, finishLessonAction };
