/*!
 * views/view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

const {SendObj} = require('webapputils-ds');
const header = require('./templates/header');
const navi = require('./templates/navi');
const tail = require('./templates/tail');


function view (wsport, naviObj, body, history={}) {
  let sendObj = new SendObj();
  sendObj.data += header();
  sendObj.data += navi(naviObj, naviObj.loggedin, history);
  sendObj.data += body;
  sendObj.data += tail();
  return sendObj;
}


module.exports = view;
