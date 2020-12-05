/*!
 * controllers/student-controller.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend } = require('webapputils-ds');
const { thisWeek, weekDayNumber } = require('../lib/dateJuggler');
const { lessonsToday } = require('../models/model-lessons');
const getNaviObj = require('../views/lib/getNaviObj');
const studentView = require('../views/student/view');
const view = require('../views/view');


function studentController (request, response, wss, wsport, user) {
  uniSend(view(wsport, getNaviObj(user), studentView(lessonsToday(user.group, weekDayNumber(), thisWeek()), thisWeek(), user, wsport)), response);
}


module.exports = studentController;
