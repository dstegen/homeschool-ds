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
      "userId": "ds@me.com",
      "password": "$2a$10$tyZ6UFV9NDkSxMM2AdvS0.br8pnPZot7aBFFE3rFczikFbDRFL5dC",
      "role": "teacher",
      "group": ["7A"],
      "courses": ["all"],
      "fname": "Daniel",
      "lname": "Stegen",
      "email": "ds@me.com",
      "phone": "+49 296112994",
      "gender": "male"
    },
    {
      "id": 100001,
      "userId": "ms@me.com",
      "password": "$2a$10$tyZ6UFV9NDkSxMM2AdvS0.br8pnPZot7aBFFE3rFczikFbDRFL5dC",
      "role": "teacher",
      "group": ["7A"],
      "courses": ["English"],
      "fname": "Mary",
      "lname": "Smith",
      "email": "ms@me.com",
      "phone": "+49 296332994",
      "gender": "female"
    },
    {
      "id": 100002,
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
    }
  ]
};

const myLessons = {
  "lessons": [
    {
      "id": 700000,
      "lesson": "Math",
      "chapter": "Functions",
      "details": "Introducting exponential functions",
      "returnHomework": "true",
      "validFrom": moment().day(1).week(moment().isoWeek()).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).week(moment().isoWeek()+1).format('YYYY-MM-DD'),
      "weekdays": [
        1,
        3,
        4,
        5
      ],
      "lessonFinished": []
    },
    {
      "id": 700001,
      "lesson": "English",
      "chapter": "past tens",
      "details": "Read the next chapter from the textbook.",
      "returnHomework": "false",
      "validFrom": moment().day(7).week(moment().isoWeek()).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).week(moment().isoWeek()+2).format('YYYY-MM-DD'),
      "weekdays": [
        1,
        2,
        4,
        5
      ],
      "lessonFinished": []
    },
    {
      "id": 700002,
      "lesson": "History",
      "chapter": "The Romans",
      "details": "Read the introduction from the history book page 70.",
      "returnHomework": "false",
      "validFrom": moment().day(7).week(moment().isoWeek()).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).week(moment().isoWeek()+4).format('YYYY-MM-DD'),
      "weekdays": [
        1,
        3
      ],
      "lessonFinished": []
    },
    {
      "id": 700003,
      "lesson": "Math",
      "chapter": "Functions II",
      "details": "Exponential functions II",
      "returnHomework": "true",
      "validFrom": moment().day(1).week(moment().isoWeek()+1).format('YYYY-MM-DD'),
      "validUntil": moment().day(7).week(moment().isoWeek()+2).format('YYYY-MM-DD'),
      "weekdays": [
        1,
        3,
        4,
        5
      ],
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
      "color": "bg-purple"
    },
    {
      "id": 2,
      "order": 2,
      "topic": "Math",
      "color": "bg-yellow"
    },
    {
      "id": 3,
      "order": 3,
      "topic": "English",
      "color": "bg-red"
    },
    {
      "id": 4,
      "order": 4,
      "topic": "History",
      "color": "bg-grey"
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
      "topicId": 1,
      "chapter": "Class meeting",
      "details": "When in quarantine, we  meet here!",
      "file": "",
      "link": "https://zoom.us/123"
    },
    {
      "id": 2,
      "topicId": 1,
      "chapter": "Homework online",
      "details": "with teacher Ms. Smith",
      "file": "",
      "link": "https://zoom.us/456"
    },
    {
      "id": 3,
      "topicId": 2,
      "chapter": "Math plan 1",
      "details": "This weeks Math exercises",
      "file": "",
      "link": ""
    },
    {
      "id": 4,
      "topicId": 2,
      "chapter": "Math plan 2",
      "details": "Next weeks Math exercises",
      "file": "",
      "link": ""
    },
    {
      "id": 5,
      "topicId": 3,
      "chapter": "English reading",
      "details": "Read Shakesbeer",
      "file": "",
      "link": ""
    },
    {
      "id": 6,
      "topicId": 4,
      "chapter": "The Romans",
      "details": "Watch the video and write a conclusion",
      "file": "",
      "link": "https://youtu.be/VI-jg3KMrSU"
    },
    {
      "id": 7,
      "topicId": 5,
      "chapter": "Anton App",
      "details": "Download the Anton App",
      "file": "",
      "link": "https://anton.app/en_us/"
    },
    {
      "id": 8,
      "topicId": 6,
      "chapter": "Teachers contact",
      "details": "If you need to contact the teachers, pls use email!",
      "file": "",
      "link": ""
    },
    {
      "id": 8,
      "topicId": 3,
      "chapter": "Places in town",
      "details": "Learn online",
      "file": "",
      "link": "https://learnenglishteens.britishcouncil.org/vocabulary/beginner-vocabulary/places-town"
    }
  ]
};

const myChat = [
    {
      "chaterId": 100000,
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
    console.log('\nDemo is installed! \n\nPls login \n - as class teacher with: ds@me.com password: 123 \n - as English teacher with: ms@me.com password: 123 \n - as student with: dm@me.com password: 123\n');
    console.log('Start the HomeSchoo-DS server with "npm start" \n');
    process.exit(0);
  } else {
    process.exit(0);
  }
});
