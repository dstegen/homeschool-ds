/*!
 * models/model-config.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');


let myConfig = loadFile(path.join(__dirname, '../data/school/config.json'), true);

function getConfig () {
  return myConfig;
}

function updateSettings (fields) {
  Object.keys(myConfig).forEach( key => {
    if (fields[key] && fields[key] !== '' && key !== 'classes') {
      myConfig[key] = fields[key];
    }
  });
  saveFile(path.join(__dirname, '../data/school'), 'config.json', myConfig);
  console.log('+ Updated schools config sucessfully!');
}


module.exports = { getConfig, updateSettings };
