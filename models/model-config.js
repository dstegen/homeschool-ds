/*!
 * models/model-config.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const config = require('../data/school/config.json');


function getConfig () {
  return {
    lang: 'de',
    schoolName: config.name,
    supportEmail: config.support_email,
    classes: config.classes
  }
}


module.exports = getConfig;
