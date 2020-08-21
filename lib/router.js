/*!
 * lib/router.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { deliver } = require('webapputils-ds');
const { webView, login, logout, editAction, updateAction, deleteAction, fileUploadAction, fileDeleteAction, finishLessonAction, updateChatAction, updatePrivateMessagesAction, updateUserAction, setPasswordAction, updatePasswordAction, editUserAction, settingsAction } = require('./controller');


function router (request, response, wss, wsport) {
  let route = request.url.substr(1).split('?')[0];
  if (request.url.includes('data') || request.url.includes('node_modules') || request.url.includes('public') || request.url.includes('favicon')) {
   deliver(request, response);
 } else if (route === 'login') {
   login(request, response, wss);
 } else if (route === 'logout') {
   logout(request, response, wss);
 } else if (route === 'setpassword') {
   setPasswordAction(request, response);
 } else if (route === 'updatepassword') {
   updatePasswordAction(request, response);
 } else if (request.url.startsWith('/edit')) {
   editAction(request, response, wss);
 } else if (request.url.startsWith('/update')) {
   updateAction(request, response, wss);
 } else if (request.url.startsWith('/fileupload')) {
   fileUploadAction(request, response);
 } else if (request.url.startsWith('/filedelete')) {
   fileDeleteAction(request, response);
 } else if (request.url.startsWith('/delete')) {
   deleteAction(request, response, wss);
 } else if (request.url.startsWith('/lessonfinished')) {
   finishLessonAction(request, response);
 } else if (request.url.startsWith('/chat')) {
   updateChatAction(request, response, wss);
 } else if (request.url.startsWith('/message')) {
   updatePrivateMessagesAction(request, response, wss);
 } else if (request.url.startsWith('/admin/edituser')) {
   editUserAction(request, response);
 } else if (request.url.startsWith('/admin/updateuser')) {
   updateUserAction(request, response);
 } else if (request.url.startsWith('/admin/settings')) {
   settingsAction(request, response);
 } else {
   webView(request, response, wss, wsport);
 }
}

 module.exports = router;
