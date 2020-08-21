/*!
 * models/model-config.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const config = require('../data/school/config.json');
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
  //console.log(fields);
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
}

module.exports = { getConfig, updateSettings };
