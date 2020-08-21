/*!
 * models/model-config.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');


const config = loadFile(path.join(__dirname, '../data/school/config.json'), true);
let myConfig = {
  lang: config.lang,
  schoolName: config.schoolName,
  supportEmail: config.supportEmail,
  classes: config.classes
};

function getConfig () {
  return myConfig;
}

function updateSettings (fields) {
  Object.keys(myConfig).forEach( key => {
    if (fields[key] && fields[key] !== '') {
      if (key === 'classes') {
        myConfig[key] = fields[key].split(',');
      } else {
        myConfig[key] = fields[key];
      }
    }
  });
  //console.log(myConfig);
  saveFile(path.join(__dirname, '../data/school'), 'config.json', myConfig);
  console.log('+ Updated schools config sucessfully!');
}


module.exports = { getConfig, updateSettings };
