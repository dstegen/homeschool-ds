/*!
 * views/classroom/attendant-students.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');


function attendantStudents (students, oddOrEven=1) {
  let returnHtml = '';
  if (typeof(students) === 'object') {
    students.forEach((item, i) => {
      if (oddOrEven === 2 && i%2 === 0) {
        returnHtml += studentAvatar(item);
      }
      if (oddOrEven === 1 && i%2 !== 0) {
        returnHtml += studentAvatar(item);
      }
    });
  }
  return returnHtml;
}


// Additional functions

function studentAvatar (user) {
  let chatterImage = '<span class="p-3 small border rounded-circle" style="width: 60px; height: 60px; display: inline-block;">' + user.fname.split('')[0] + user.lname.split('')[0] + '</span>';
  if (fs.existsSync(path.join(__dirname, '../../data/school/pics/', user.id+'.jpg'))) {
    chatterImage = `<img src="/data/school/pics/${user.id}.jpg" height="60" width="60" class="img-fluid border rounded-circle"/>`;
  }
  return `
    <div id="${user.id}" class="text-center mb-3 mr-2" style="min-width: 100px;">
      <div class="d-block">
        ${chatterImage}
        <svg style="display: none; float:right;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffc107" class="bi bi-hand-index-fill" viewBox="0 0 16 16">
          <path d="M8.5 4.466V1.75a1.75 1.75 0 0 0-3.5 0v5.34l-1.199.24a1.5 1.5 0 0 0-1.197 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.272-2.715a2 2 0 0 0-1.99-2.199h-.582a5.184 5.184 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.634 2.634 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002z"/>
        </svg>
      </div>
      <small>${user.fname} ${user.lname}</small>
    </div>
  `;
}


module.exports = attendantStudents;
