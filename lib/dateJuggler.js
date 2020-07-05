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
  return week; //Number
}

function thisDay (inDay) {
  let day = moment().dayOfYear();
  if (inDay !== undefined && inDay !== '') {
    day = moment(inDay).dayOfYear();
  }
  return day; //Number
}

function weekDates (curWeek=thisWeek()) {
  let today = moment();
  if (curWeek !== undefined && curWeek !== '') {
    today = moment().isoWeek(curWeek);
  }
  return  today.day(1).week(curWeek).format('LL') + ' – ' + today.day(+7).week(curWeek).format('LL'); //String
}

function weekDayNumber (inDay=thisDay()) {
  return moment(moment().dayOfYear(inDay)).day(); //Number
}

function formatDay (inDay) {
  let today = moment().format('dddd[, der] DD. MMM YYYY')
  if (inDay !== undefined && inDay !== '' && Number.isInteger(Number(inDay)))  today = moment().dayOfYear(inDay).format('dddd[, der] DD. MMMM')
  return today; //String
}

function formatDate (weekday=1, week=thisWeek()) {
  return moment().day(weekday).week(week).format('LL'); //String
}

function weekDay (weekday=1) {
  return moment().day(weekday).format('dddd'); //String
}

function beforeToday (weekday=1, week=thisWeek()) {
  let today = moment();
  let inDay = moment().week(week).day(weekday);
  return moment(inDay).isBefore(today); //Boolean
}

function isActualWeek (startDate, endDate, week=thisWeek()) {
  let today = moment().week(week);
  return moment(today).isBetween(startDate, endDate, 'day', '[]'); //Boolean
}

function momentFromDay (inDay) {
  return moment(moment().dayOfYear(inDay)); //Date
}

module.exports = { thisWeek, thisDay, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek, momentFromDay }
