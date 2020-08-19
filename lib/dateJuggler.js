/*!
 * lib/dateJuggler.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';
// Required Modules
const moment = require('moment');
const config = require('../models/model-config')();
moment.locale(config.lang);


function thisWeek (inDate) {
  let week = moment().isoWeek();
  if (moment(inDate).isValid()) {
    week = moment(inDate).isoWeek();
  }
  return week; //Number
}

function thisDay (inDate) {
  let day = moment().dayOfYear();
  if (inDate !== undefined && inDate !== '') {
    day = moment(inDate).dayOfYear();
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
  let today = moment().format('dddd[, ] DD. MMM YYYY')
  if (inDay !== undefined && inDay !== '' && Number.isInteger(Number(inDay)))  today = moment().dayOfYear(inDay).format('dddd[, ] DD. MMMM')
  return today; //String
}

function formatDate (weekday=1, week=thisWeek()) {
  return moment().day(weekday).week(week).format('LL'); //String
}

function weekDay (weekday=moment().day()) {
  return moment().day(weekday).format('dddd'); //String
}

function beforeToday (weekday=1, week=thisWeek()) {
  let today = moment();
  let inDay = moment().isoWeek(week).day(weekday-7);
  return moment(inDay).isBefore(today); //Boolean
}

function beforeFinishDate (finishDate, today = moment()) {
  moment(finishDate).isoWeek();
  if (moment(finishDate).isoWeek() === moment(today).isoWeek()) {
    return true;
  } else {
    return false;
  }
}

function notValid (inDate, today=moment()) {
  return moment(today).isAfter(inDate); //Boolean
}

function isActualWeek (startDate, endDate, week=thisWeek()) {
  let today = moment().week(week);
  return moment(today).isBetween(startDate, endDate, 'day', '[]'); //Boolean
}

function momentFromDay (inDay) {
  return moment(moment().dayOfYear(inDay)); //Date
}

function workdaysBetween (startDate, endDate, weekdays=[1,2,3,4,5]) {
  let workdays = 0;
  let offset = 0;
  weekdays.forEach( day => {
    if (day < moment(startDate).day() || moment(startDate).day() === 0) {
      offset++;
    }
    if (moment(endDate).day() !== 0 && day > moment(endDate).day()) {
      offset++;
    }
  });
  let startWeek = moment(startDate).isoWeek();
  let endWeek = moment(endDate).isoWeek();
  if (startWeek <= endWeek) {
    workdays = weekdays.length * (endWeek - startWeek +1);
  } else {
    if (moment(startDate).isoWeeksInYear() === 53) {
      workdays = weekdays.length * (54 - startWeek + endWeek);
    } else {
      workdays = weekdays.length * (53 - startWeek + endWeek);
    }
  }
  return workdays - offset; // Number
}

function dateIsRecent (inDate, days=3) {
  if (inDate === undefined) {
    return false;
  } else {
    return moment(inDate).add(days, 'days').isAfter(moment()); //Boolean
  }
}

function getDaytime () {
  if (moment().hour() > 18) {
    return 'NIGHT';
  } else {
    return moment().format('A');
  }
}


module.exports = { thisWeek, thisDay, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek, momentFromDay, workdaysBetween, dateIsRecent, beforeFinishDate, notValid, getDaytime };
