/*!
 * views/lib/getNaviObj.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const school = require('../../data/school/config.json');

function getNaviObj (role, loginname='') {
  switch (role) {
    case 'student':
    return {
      school: school.name,
      loginname: 'Student: '+loginname,
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
          link: '/student/week',
          dropdown: false
        }
      ]
    };
    case 'teacher':
    return {
      school: school.name,
      loginname: 'Teacher: '+loginname,
      home: {
        name: 'HomeSchool-DS',
        link: '/teacher'
      },
      menuItems: [
        {
          name: 'my classes',
          link: '/teacher/classes',
          dropdown: false
        },
        {
          name: 'lessons',
          link: '/teacher/lessons',
          dropdown: false
        }
      ]
    };
    default:
      return {
        school: school.name,
        loginname: '',
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
