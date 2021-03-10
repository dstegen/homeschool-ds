/*!
 * helper/install-example.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const readline = require('readline');
const cl = require('./user-importer');
const saveFile = require('../utils/save-file');
const createDir = require('../utils/create-dir');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const schoolConfig = {
  "lang": "en",
  "schoolName": "My School",
  "supportEmail": "",
  "classes": ["7A"],
  "courseColors": [
    "bg-green",
    "bg-blue",
    "bg-red",
    "bg-yellow",
    "bg-brown",
    "bg-grey",
    "bg-teal",
    "bg-purple"
  ],
  "delMessagesAfter": "30",
  "delChatsAfter": "15"
};

let users = [
    {
      "id": 100000,
      "userId": "admin@me.com",
      "password": "$2a$10$tyZ6UFV9NDkSxMM2AdvS0.br8pnPZot7aBFFE3rFczikFbDRFL5dC",
      "role": "admin",
      "group": ["7A"],
      "leader": ["7A"],
      "courses": [],
      "fname": "Admin",
      "lname": "Steen",
      "email": "admin@me.com",
      "phone": "+49 296112994",
      "gender": "female"
    },
    {
      "id": 100001,
      "userId": "ds@me.com",
      "password": "$2a$10$tyZ6UFV9NDkSxMM2AdvS0.br8pnPZot7aBFFE3rFczikFbDRFL5dC",
      "role": "teacher",
      "group": ["7A"],
      "leader": ["7A"],
      "courses": [],
      "fname": "Dan",
      "lname": "Steen",
      "email": "ds@me.com",
      "phone": "+49 296112994",
      "gender": "male"
    },
    {
      "id": 100002,
      "userId": "ms@me.com",
      "password": "$2a$10$tyZ6UFV9NDkSxMM2AdvS0.br8pnPZot7aBFFE3rFczikFbDRFL5dC",
      "role": "teacher",
      "group": ["7A"],
      "leader": [],
      "courses": ["English"],
      "fname": "Mary",
      "lname": "Smith",
      "email": "ms@me.com",
      "phone": "+49 296332994",
      "gender": "female"
    },
    {
      "id": 100003,
      "userId": "dm@me.com",
      "password": "$2a$10$tyZ6UFV9NDkSxMM2AdvS0.br8pnPZot7aBFFE3rFczikFbDRFL5dC",
      "role": "student",
      "group": "7A",
      "fname": "Dave",
      "lname": "Muller",
      "email": "dm@me.com",
      "phone": "+49 2960823294",
      "gender": "male"
    }
  ];

try {
  let namesList = fs.readFileSync(path.join(__dirname, '../helper/names_int.csv')).toString().split('\n');
  users = cl(namesList, users, '7A');
} catch (e) {
  console.log('- ERROR couldn\'t extend users: '+e);
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
    },
    {
      "name": "Onlinelesson",
      "lpw": 2,
      "color": "bg-purple"
    }
  ],
  "lessonTimeslots": [
    "",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00"
  ]
};

const startWeek = moment().isoWeek();

const myLessons = {
  "lessons": [
    {
      "id": 700000,
      "group": "7A",
      "lessonType": "homelesson",
      "lesson": "Math",
      "chapter": "Functions",
      "details": "Introducting exponential functions",
      "returnHomework": true,
      "startWeek": startWeek,
      "weekAmount": "2",
      "validFrom": moment().day(1).isoWeek(startWeek).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).isoWeek(startWeek+1).format('YYYY-MM-DD'),
      "amount": "4",
      "weekdays": [
        1,
        3,
        4,
        5
      ],
      "time": "",
      "lessonFinished": []
    },
    {
      "id": 700001,
      "group": "7A",
      "lessonType": "homelesson",
      "lesson": "English",
      "chapter": "past tens",
      "details": "Read the next chapter from the textbook.",
      "returnHomework": true,
      "startWeek": startWeek,
      "weekAmount": "3",
      "validFrom": moment().day(1).isoWeek(startWeek).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).isoWeek(startWeek+2).format('YYYY-MM-DD'),
      "amount": "4",
      "weekdays": [
        1,
        2,
        4,
        5
      ],
      "time": "",
      "lessonFinished": []
    },
    {
      "id": 700002,
      "group": "7A",
      "lessonType": "homelesson",
      "lesson": "History",
      "chapter": "The Romans",
      "details": "Read the introduction from the history book page 70.",
      "returnHomework": false,
      "startWeek": startWeek,
      "weekAmount": "5",
      "validFrom": moment().day(1).isoWeek(startWeek).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).isoWeek(startWeek+4).format('YYYY-MM-DD'),
      "amount": "2",
      "weekdays": [
        1,
        3
      ],
      "time": "",
      "lessonFinished": []
    },
    {
      "id": 700003,
      "group": "7A",
      "lessonType": "onlinelesson",
      "lesson": "Math",
      "chapter": "Online introduction",
      "details": "Exponential functions II",
      "returnHomework": false,
      "startWeek": moment().isoWeek(),
      "weekAmount": "2",
      "validFrom": moment().day(1).isoWeek(startWeek).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).isoWeek(startWeek+2).format('YYYY-MM-DD'),
      "amount": "",
      "weekdays": [
        3
      ],
      "time": "10:00",
      "lessonFinished": []
    },
    {
      "id": 700004,
      "group": "7A",
      "lessonType": "onlinelesson",
      "lesson": "Onlinelesson",
      "chapter": "Class meeting",
      "details": "Every monday at 9:00 am",
      "returnHomework": false,
      "startWeek": moment().isoWeek(),
      "weekAmount": "2",
      "validFrom": moment().day(1).isoWeek(startWeek).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).isoWeek(startWeek+2).format('YYYY-MM-DD'),
      "amount": "",
      "weekdays": [
        1
      ],
      "time": "09:00",
      "lessonFinished": []
    }
  ]
}

const myBoard = {
  "topics": [
    {
      "id": 1,
      "order": 1,
      "topic": "Videomeeting",
      "color": "",
      "autofill": true,
      "autofillWith": "Onlinelesson"
    },
    {
      "id": 2,
      "order": 2,
      "topic": "Math",
      "color": "",
      "autofill": true,
      "autofillWith": "Math"
    },
    {
      "id": 3,
      "order": 3,
      "topic": "English",
      "color": "",
      "autofill": true,
      "autofillWith": "English"
    },
    {
      "id": 4,
      "order": 4,
      "topic": "History",
      "color": "",
      "autofill": true,
      "autofillWith": "History"
    },
    {
      "id": 5,
      "order": 5,
      "topic": "Infos",
      "color": "bg-purple"
    },
    {
      "id": 6,
      "order": 6,
      "topic": "Parents",
      "color": "bg-purple"
    }
  ],
  "cards": [
    {
      "id": 1,
      "topicId": 5,
      "chapter": "Anton App",
      "details": "Download the Anton App",
      "files": "",
      "link": "https://anton.app/en_us/"
    },
    {
      "id": 2,
      "topicId": 6,
      "chapter": "Teachers contact",
      "details": "If you need to contact the teachers, pls use email!",
      "files": "",
      "link": ""
    },
    {
      "id": 3,
      "topicId": 3,
      "chapter": "Places in town",
      "details": "Learn online",
      "files": "",
      "link": "https://learnenglishteens.britishcouncil.org/vocabulary/beginner-vocabulary/places-town"
    }
  ]
};

const myChat = [
    {
      "chaterId": 100001,
      "timeStamp": new Date(),
      "chat": "Hello students!"
    }
  ]

const myPrivateMessages = [];

console.log("\n- Do you want to install the demo? (Y/N) ");
rl.on('line', function (input) {
  if (input === 'y' || input === 'Y') {
    console.log('\n+ Installing the demo...');
    createDir(path.join(__dirname, '../data'));
    createDir(path.join(__dirname, '../data/school'));
    createDir(path.join(__dirname, '../data/school/pics'));
    createDir(path.join(__dirname, '../data/classes'));
    createDir(path.join(__dirname, '../data/classes/7A'));
    saveFile(path.join(__dirname, '../data/school'), 'config.json', schoolConfig);
    saveFile(path.join(__dirname, '../data/school'), 'users.json', users);
    saveFile(path.join(__dirname, '../data/school'), 'private-messages.json', myPrivateMessages);
    saveFile(path.join(__dirname, '../data/classes/7A'), 'config.json', classConfig);
    saveFile(path.join(__dirname, '../data/classes/7A'), 'lessons.json', myLessons);
    saveFile(path.join(__dirname, '../data/classes/7A'), 'board.json', myBoard);
    saveFile(path.join(__dirname, '../data/classes/7A'), 'chat.json', myChat);
    console.log('\nDemo is installed! \n\nPls login \n - as admin with: admin@me.com password: 123 \n - as class teacher with: ds@me.com password: 123 \n - as English teacher with: ms@me.com password: 123 \n - as student with: dm@me.com password: 123\n');
    console.log('Start the HomeSchoo-DS server with "npm start" \n');
    process.exit(0);
  } else {
    process.exit(0);
  }
});
