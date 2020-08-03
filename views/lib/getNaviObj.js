/*!
 * views/lib/getNaviObj.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const { getLatestMessages } = require('../../models/model-messages');
const { getTitleNameById } = require('../../models/model-user');
const school = require('../../data/school/config.json');


function getNaviObj (user) {
  let role = '';
  if (user) role = user.role;
  let myGroup = [];
  let lessonsDropdown = [];
  let classesDropdown = [];
  switch (role) {
    case 'student':
    return {
      school: school.name,
      loginname: 'Student: '+getTitleNameById(user.id),
      loggedin: true,
      home: {
        name: 'HomeSchool-DS',
        link: '/student'
      },
      menuItems: [
        {
          name: 'today',
          link: '/student/day',
          dropdown: false
        },
        {
          name: 'this week',
          link: '/timetable',
          dropdown: false
        },
        {
          name: 'communication',
          link: '/communication',
          dropdown: false
        }
      ],
      newMessages: getLatestMessages(user.id).length
    };
    case 'teacher':
    myGroup = user.group;
    lessonsDropdown = [
      {
        name: 'Overview',
        link: '/teacher/lessons'
      }
    ]
    for (let i=0; i<myGroup.length; i++) {
      lessonsDropdown.push(
        {
          name: '+ New Lesson '+myGroup[i],
          link: '/edit/'+myGroup[i]
        }
      )
    }
    for (let i=0; i<myGroup.length; i++) {
      classesDropdown.push(
        {
          name: 'Class '+myGroup[i],
          link: '/teacher/classes/'+myGroup[i]
        }
      )
    }
    return {
      school: school.name,
      loginname: 'Teacher: '+getTitleNameById(user.id),
      loggedin: true,
      home: {
        name: 'HomeSchool-DS',
        link: '/teacher'
      },
      menuItems: [
        {
          name: 'communication',
          link: '/communication',
          dropdown: false
        },
        {
          name: 'my classes',
          link: '#',
          dropdown: true,
          dropdownItems: classesDropdown
        },
        {
          name: 'lessons',
          link: '#',
          dropdown: true,
          dropdownItems: lessonsDropdown
        }
      ],
      newMessages: getLatestMessages(user.id).length
    };
    default:
      return {
        school: school.name,
        loginname: '',
        loggedin: false,
        home: {
          name: 'HomeSchool-DS',
          link: '#dashboard'
        },
        menuItems: [
          {
            name: 'support',
            link: 'mailto:info@myschool.com',
            dropdown: false
          }
        ]
      };
  }
}


module.exports = getNaviObj;
