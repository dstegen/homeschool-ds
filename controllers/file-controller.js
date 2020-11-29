/*!
 * controllers/file-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { updateLesson, finishLesson, deleteFileFromLesson, deleteFileFromLessonFinished } = require('../models/model-lessons');
const fileUpload = require('../lib/file-upload');
const fileDelete = require('../lib/file-delete');
const { deleteFileFromCard } = require('../models/model-board');


function fileUploadAction (request, response, user) {
  let urlPath = '';
  getFormObj(request).then(
    data => {
      let filePath = '';
      urlPath = data.fields.urlPath;
      if (user.role === 'student') {
        filePath = path.join('courses', data.fields.course, data.fields.courseId, 'homework', user.id.toString());
        if (fileUpload(data.fields, data.files, filePath)) {
          let addFields = {
            group: data.fields.group,
            courseId: data.fields.courseId,
            studentId: user.id,
            file: path.join('/data/classes', data.fields.group, filePath, data.files.filetoupload.name)
          }
          finishLesson(addFields);
        }
      } else if (user.role === 'teacher') {
        filePath = path.join('courses', data.fields.course, data.fields.courseId, 'material');
        if (fileUpload(data.fields, data.files, filePath)) {
          let addFields = {
            group: data.fields.group,
            id: data.fields.courseId,
            files: path.join('/data/classes', data.fields.group, filePath, data.files.filetoupload.name)
          }
          updateLesson(addFields);
        }
      }
      uniSend(new SendObj(302, [], '', urlPath), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t handle file upload: '+error.message);
  });
}

function fileDeleteAction (request, response) {
  let urlPath = '';
  getFormObj(request).then(
    data => {
      urlPath = data.fields.urlPath;
      if (fileDelete(data.fields)) {
        if (data.fields.section === 'cards') {
          deleteFileFromCard(data.fields);
        } else if (data.fields.studentId && data.fields.studentId !== '') {
          deleteFileFromLessonFinished(data.fields.group, Number(data.fields.lessonId), Number(data.fields.studentId), data.fields.filePath);
        } else {
          deleteFileFromLesson(data.fields.group, Number(data.fields.lessonId), data.fields.filePath);
        }
      }
      uniSend(new SendObj(302, [], '', urlPath), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t handle file delete: '+error.message);
  });
}

module.exports = { fileUploadAction, fileDeleteAction };
