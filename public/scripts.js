/*!
 * public/scripts.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

 // Start Clock
 updateClock();
 setInterval('updateClock()', 1000 );

 // Init some scripts and settings
 $(document).ready(function () {
   // Init bsCustomFileInput-script for better file-upload forms
   bsCustomFileInput.init();
   // Enable tooltip
   $(function () {
     $('[data-toggle="tooltip"]').tooltip()
   });
   // Chat & chat-windows
   initChat();
   // blackboard
   if (document.location.toString().includes('classroom')) {
     initBlackboard();
   }
   // Open targetted lessonBig
   if (document.location.pathname.includes('day') && document.location.pathname.split('/')[4] !== undefined) {
     $('#lessonbig-details-'+document.location.pathname.split('/').pop()).collapse('toggle');
   }
 });

// Initialize Chat functions
function initChat () {
  for (let i=0; i<$('.chat-window').length; i++) {
    $('#'+$('.chat-window')[i].id).scrollTop($('.chat-window')[i].scrollHeight);
  };
  if (!localStorage.closedChats) {
    localStorage.closedChats = '';
  }
  localStorage.closedChats.split(',').forEach(item => {
    if (item != '') {
      $('#'+item).collapse('hide');
      $('#toggle-button-'+item.split('-')[2]).text(' + ');
    }
  });
  if (newMessages > 0) {
    $('#topnavi-communication').append('<span class="badge badge-light ml-1">'+newMessages+'</span>');
  }
}

function toggleChat (id) {
  console.log(id);
  if ($('#'+id+'.collapse.show').length > 0) {
    $('#'+id).collapse('hide');
    $('#toggle-button-'+id.split('-')[2]).text(' + ');
    let closedChats = localStorage.closedChats.split(',').filter( item => item !== '');
    closedChats.push(id);
    localStorage.closedChats = closedChats;
    console.log(localStorage.closedChats);
  } else {
    $('#'+id).collapse('show');
    $('#toggle-button-'+id.split('-')[2]).text(' - ');
    let closedChats = localStorage.closedChats.split(',').filter( item => item !== '');
    closedChats.splice(closedChats.indexOf(id),1);
    localStorage.closedChats = closedChats;
    console.log(localStorage.closedChats);
  }
}

// newPrivateMessage-Modal
function showNewPrivateMessage (myGroup, chatMate) {
  $('#new-message-'+myGroup+' form select').val(chatMate);
  $('#new-message-'+myGroup).collapse('show');
}

// E-Mail function for onclick
function sendEmail (email) {
  window.location = "mailto:"+email;
}

// Add "Are you sure?"-Alert to delete-buttons
function confirmDelete (id, action) {
  //console.log(id+':'+action);
  let confirmQuestion = 'Are you sure, you want to delete this item?';
  if (confirm(confirmQuestion)) {
    $('#'+id).attr('action', action);
    $('#'+id).submit();
  }
};

function fileDelete (formId) {
  //console.log(formId);
  let confirmQuestion = 'Are you sure, you want to delete this item?';
  if (confirm(confirmQuestion)) {
    $('#'+formId).submit();
  }
}

// Filter lessons on all-lessons-view
function filterLessons (lesson) {
  let allLessonsList = document.getElementsByClassName('lesson-box');
  if (lesson !== 'Filter...') {
    for (let i=0; i<allLessonsList.length; i++) {
      allLessonsList[i].hidden = true;
    }
  } else {
    for (let i=0; i<allLessonsList.length; i++) {
      allLessonsList[i].hidden = false;
    }
  }
  let allShowLessons = document.getElementsByClassName('details-box-'+lesson);
  for (let i=0; i<allShowLessons.length; i++) {
    allShowLessons[i].hidden = false;
  }
}

// Check if new password and retype match
$(document).ready(function () {
  if (window.location.pathname === '/setpassword') {
    $("#txtConfirmPassword").keyup(isPasswordMatch());
  }
});

// Edit user functions
function selectGroup (group) {
  console.log(group);
  window.location = "/admin/edituser?"+group;
}

function selectGroupSettings (group) {
  console.log(group);
  window.location = "/admin/settings?"+group;
}

function selectUser (userId) {
  window.location = "/admin/edituser/"+userId;
}

// Edit boards
function enableDisableInput (checkbox, enableElement, disableElement) {
  if(checkbox.checked == true) {
    $(enableElement).prop('disabled', false);
    if (disableElement) $(disableElement).prop('disabled', 'disabled');
  } else {
    $(enableElement).prop('disabled', 'disabled');
    if (disableElement) $(disableElement).prop('disabled', false);
  }
}

// jQuery-ui sortable
$( function() {
  $(".sortable").sortable({
    update: function( event, ui ) {}
  });
  $(".sortable").sortable( "option", "cancel", "form,a,button" );
});

$(".sortable").on("sortupdate", function(event, ui) {
  var myList = document.getElementsByClassName("board-frame");
  var ordList = myList[0].getElementsByClassName("board-topic");
  var newOrder = [];
  for (var i=0; i<ordList.length; i++) {
    newOrder.push(ordList[i].id.replace(/topic-/,''));
  }
  var curGroup = window.location.pathname.split('/')[2];
  console.log('group: '+curGroup+', New Order: '+newOrder);
  $.ajax({
    url: '/board/'+curGroup+'/reorder', // url where to submit the request
    type : "POST", // type of action POST || GET
    dataType : 'json', // data type
    data : {"group": curGroup, "newOrder": newOrder},
    success : function(result) {
        console.log(result);
    }
  });
  $("#feedback .modal-content").html('Re-order was saved!<br>Class: '+curGroup+' New Order: '+newOrder);
  $("#feedback").modal('show');
  setTimeout( function () {$("#feedback").modal('hide');}, 2500);
} );


// blackboard functions

function requestClassroomAccess () {
  window.location.replace('/classroom/requestaccess');
}

function initBlackboard () {
  // When true, moving the mouse draws on the canvas
  let isDrawing = false;
  let x = 0;
  let y = 0;

  const myPics = document.getElementById('myBlackboard');
  const context = myPics.getContext('2d');

  // event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

  // Add the event listeners for mousedown, mousemove, and mouseup
  myPics.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
  });

  myPics.addEventListener('mousemove', e => {
    if (isDrawing === true) {
      drawLine(context, x, y, e.offsetX, e.offsetY);
      x = e.offsetX;
      y = e.offsetY;
    }
  });

  window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
      drawLine(context, x, y, e.offsetX, e.offsetY);
      x = 0;
      y = 0;
      isDrawing = false;
      transmitBlackboard(context);
    }
  });
}

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function transmitBlackboard (ctx) {
  var curContent = ctx.getImageData(0,0,1110,500);
  var curGroup = window.location.pathname.split('/')[2];
  $.ajax({
    url: '/classroom/update/'+curGroup, // url where to submit the request
    type : "POST", // type of action POST || GET
    dataType : 'json', // data type
    data : {"group": curGroup, "ctx": curContent},
    success : function(result) {
        console.log(result);
    }
  });
}
