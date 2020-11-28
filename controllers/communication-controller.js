/*!
 * controllers/communication-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { updateChat } = require('../models/model-chat');
const { updatePrivateMessages } = require('../models/model-messages');
const getNaviObj = require('../views/lib/getNaviObj');
const comView = require('../views/communication-view');
const view = require('../views/view');


function communicationController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (route.startsWith('communication/chat')) {
    updateChatAction(request, response, wss);
  } else if (route.startsWith('communication/message')) {
    updatePrivateMessagesAction(request, response, wss);
  } else {
    uniSend(view(wsport, naviObj, comView(user, wsport)), response);
  }
}


// Additional functions

function updateChatAction (request, response, wss) {
  getFormObj(request).then(
    data => {
      updateChat(data.fields);
      try {
        wss.clients.forEach(client => {
          setTimeout(function () {
            client.send('chatUpdate')
          }, 100);
        });
      } catch (e) {
        console.log('- ERROR sending websocket message to all clients: '+e);
      }
      uniSend(new SendObj(302, [], '', '/communication'), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update chat: '+error.message);
  });
}

function updatePrivateMessagesAction (request, response, wss) {
  getFormObj(request).then(
    data => {
      updatePrivateMessages(data.fields);
      try {
        wss.clients.forEach(client => {
          setTimeout(function () {
            client.send('chatUpdate')
          }, 100);
        });
      } catch (e) {
        console.log('- ERROR sending websocket message to all clients: '+e);
      }
      uniSend(new SendObj(302, [], '', '/communication'), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update private messages: '+error.message);
  });
}


module.exports = communicationController;
