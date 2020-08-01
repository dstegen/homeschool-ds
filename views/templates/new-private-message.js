/*!
 * views/templates/new-private-messages.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const { getAllUsers, getUserById } = require('../../models/model-user');


function newPrivateMessage (userId='', chatMateId='') {
  const user = getUserById(userId);
  let allUsers = [];
  let allOptions = '';
  if (user.role === 'teacher') {
    allUsers = getAllUsers().filter( item => user.group.includes(item.group));
    allOptions = allUsers.map( item => { return `<option value="${item.id}" ${item.id === Number(chatMateId) ? 'selected' : ''}>${item.fname} ${item.lname} (${item.group})</option>` }).join('');
  } else if (user.role === 'student') {
    allUsers = getAllUsers().filter( item => (item.group.includes(user.group) && item.role === 'teacher'));
    allOptions = allUsers.map( item => { return '<option value="'+item.id+'">Mr/Ms '+item.lname+'</option>' }).join('');
  }
  return `
    <div class="border py-2 px-3 mb-3">
      <form id="newMessage-form" action="/message" method="post">
        <input type="text" name="chatterId" class="d-none" hidden value="${userId}" />
        <div class="form-group form-inline justify-content-between">
          <h4>Neue Unterhaltung mit</h4>
          <select class="form-control" id="chatMate" name="chatMate">
            <option></option>
            ${allOptions}
          </select>
        </div>
        <hr />
        <div class="d-flex justify-content-between">
          <input type="texte" class="form-control mr-2" id="userchat" name="userchat" placeholder="Write something..." value="" />
          <button type="submit" class="btn btn-sm btn-primary">Send</button>
        </div>
      </form>
    </div>
  `;
}


module.exports = newPrivateMessage;
