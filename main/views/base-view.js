/*!
 * main/views/base-view.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

const {SendObj} = require('webapputils-ds');
const header = require('../../main/templates/header');
const navi = require('../../main/templates/navi');
const tail = require('../../main/templates/tail');


function baseView (wsport, naviObj, body, history={}) {
  let sendObj = new SendObj();
  sendObj.data += header();
  sendObj.data += navi(naviObj, naviObj.loggedin, history);
  sendObj.data += body;
  sendObj.data += tail();
  return sendObj;
}


module.exports = baseView;
