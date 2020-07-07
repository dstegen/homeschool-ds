/*!
 * helper/install-example.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const schoolConfig = {
  "name": "My School"
};

const users = {
  "users": [
    {
      "id": 0,
      "userId": "ds@me.com",
      "password": "$2a$10$tyZ6UFV9NDkSxMM2AdvS0.br8pnPZot7aBFFE3rFczikFbDRFL5dC",
      "role": "teacher",
      "group": ["7A"],
      "courses": ["all"],
      "fname": "Daniel",
      "lname": "Stegen",
      "email": "ds@me.com"
    },
    {
      "id": 1,
      "userId": "ms@me.com",
      "password": "$2a$10$tyZ6UFV9NDkSxMM2AdvS0.br8pnPZot7aBFFE3rFczikFbDRFL5dC",
      "role": "teacher",
      "group": ["7A"],
      "courses": ["English"],
      "fname": "Mary",
      "lname": "Smith",
      "email": "ms@me.com"
    },
    {
      "id": 2,
      "userId": "dm@me.com",
      "password": "$2a$10$tyZ6UFV9NDkSxMM2AdvS0.br8pnPZot7aBFFE3rFczikFbDRFL5dC",
      "role": "student",
      "group": "7A",
      "fname": "Dave",
      "lname": "Muller",
      "email": "dm@me.com"
    }
  ]
}

const classConfig = {
  "courses": [
    {
      "name": "Math",
      "color": "bg-red",
      "lpw": 4
    },
    {
      "name": "English",
      "color": "bg-yellow",
      "lpw": 2
    },
    {
      "name": "History",
      "color": "bg-teal",
      "lpw": 2
    }
  ]
};

const myLessons = {
  "lessons": [
    {
      "id": 0,
      "lesson": "Math",
      "chapter": "Functions",
      "details": "Introducting exponential functions",
      "validFrom": moment().day(1).week(moment().isoWeek()).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).week(moment().isoWeek()+4).format('YYYY-MM-DD'),
      "weekdays": [
        1,
        3,
        4,
        5
      ]
    },
    {
      "id": 1,
      "lesson": "English",
      "chapter": "past tens",
      "details": "Read the next chapter from the textbook.",
      "validFrom": moment().day(7).week(moment().isoWeek()).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).week(moment().isoWeek()+4).format('YYYY-MM-DD'),
      "weekdays": [
        1,
        2,
        4,
        5
      ]
    },
    {
      "id": 2,
      "lesson": "History",
      "chapter": "The Romans",
      "details": "Read the introduction from the history book page 70.",
      "validFrom": moment().day(7).week(moment().isoWeek()).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).week(moment().isoWeek()+4).format('YYYY-MM-DD'),
      "weekdays": [
        1,
        3
      ]
    }
  ]
}

console.log("\n- Do you want to install the demo? (Y/N) ");
rl.on('line', function (input) {
  if (input === 'y' || input === 'Y') {
    console.log('\n+ Installing the demo...');
    createDir('/data');
    createDir('/data/school');
    createDir('/data/classes');
    createDir('/data/classes/7A');
    saveFile('/data/school/config.json', schoolConfig);
    saveFile('/data/school/users.json', users);
    saveFile('/data/classes/7A/config.json', classConfig);
    saveFile('/data/classes/7A/lessons.json', myLessons);
    console.log('\nDemo is installed! \n\nPls login \n - as class teacher with: ds@me.com password: 123 \n - as English teacher with: ms@me.com password: 123 \n - as student with: dm@me.com password: 123\n');
    console.log('Start the HomeSchoo-DS server with "npm start" \n');
    process.exit(0);
  } else {
    process.exit(0);
  }
});


// Additional functions

function createDir (filePath) {
  if (!fs.existsSync(path.join(__dirname, '../', filePath))) {
    console.log('* Creating directory: '+filePath);
    fs.mkdirSync(path.join(__dirname, '../', filePath));
  } else {
    console.log('- directory already exists: '+filePath);
  }
}

function saveFile (filePath, file) {
  if (!fs.existsSync(path.join(__dirname, '../', filePath))) {
    console.log('* Creating file: '+filePath);
    fs.writeFileSync(path.join(__dirname, '../', filePath), JSON.stringify(file));
  } else {
    console.log('- file already exists: '+filePath);
  }
}
