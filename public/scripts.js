/*!
 * public/scripts.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

 // Start Clock
 updateClock();
 setInterval('updateClock()', 1000 );

// Enable tooltip
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// E-Mail function for onclick
function sendEmail (email) {
  window.location = "mailto:"+email;
}

// Add "Are you sure?"-Alert to delete-buttons
function confirmDelete (id, action) {
  //console.log(id);
  let confirmQuestion = 'Are you sure, you want to delete this item?';
  if (confirm(confirmQuestion)) {
    $('#'+id + ' .form_action').attr('value', action);
    $('#'+id).submit();
  }
};
