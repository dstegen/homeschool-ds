/*!
 * views/lib/getNaviObj.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';


function getNaviObj (role, loginname='') {
  switch (role) {
    case 'student':
    return {
      school: 'Internationale Gesamtschule Heidelberg',
      loginname: 'Student: '+loginname,
      home: {
        name: 'HomeSchool-DS',
        link: '#dashboard'
      },
      menuItems: [
        {
          name: 'today',
          link: '#today',
          dropdown: false
        },
        {
          name: 'this week',
          link: '#week',
          dropdown: false
        }
      ]
    };
    default:
      return {
        school: 'Internationale Gesamtschule Heidelberg',
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
