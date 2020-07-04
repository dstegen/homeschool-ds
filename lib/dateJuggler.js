/*!
 * lib/dateJuggler.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const moment = require('moment');
moment.locale('de');

function thisWeek (inDate) {
  let week = moment().isoWeek();
  if (moment(inDate).isValid()) {
    week = moment(inDate).isoWeek();
  }
  return week;
}

function weekDates (curWeek) {
  let today = moment();
  if (curWeek !== undefined && curWeek !== '') {
    today = moment().week(curWeek);
  }
  return  today.day(1).format('LL') + ' bis ' + today.day(+6).format('LL');
}

function weekDayNumber () {
  return moment().day();
}

function formatDay (inDate) {
  let today = moment().format('dddd[, der] DD. MMM YYYY')
  if (inDate !== undefined && inDate !== '' && moment(inDate).isValid()) today = moment(inDate).format('dddd[, der] DD. MMM.')
  return today;
}

function formatDate (weekday=1, week=thisWeek()) {
  return moment().week(week).day(weekday).format('LL');
}

function weekDay (weekday=1) {
  return moment().day(weekday).format('dddd');
}

function beforeToday (weekday=1, week=thisWeek()) {
  let today = moment();
  let inDay = moment().week(week).day(weekday);
  return moment(inDay).isBefore(today);
}

function isActualWeek (startDate, endDate, week=thisWeek()) {
  let today = moment().week(week);
  return moment(today).isBetween(startDate, endDate);
}


module.exports = { thisWeek, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek }
