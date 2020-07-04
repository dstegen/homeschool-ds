/*!
 * views/templates/navi.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';


function navi (naviObj, loggedIn, history) {
  let loggedInHtml = '';
  if (loggedIn) {
    loggedInHtml += `
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
        <div class="navbar-nav">
        ${naviObj.menuItems.map(helperMenuItem).join('')}
        <div class="nav-item">
          <form action="/logout" method="post" enctype="application/x-www-form-urlencoded" name="logout-form">
          <input type="text" readonly class="d-none form_action" id="action" name="action" value="logout">
          <button type="submit" class="nav-link navi-onoff">
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="6" stroke="rgba(255,255,255,0.8)" stroke-width="2" fill="none" />
              <rect x="8" y="0" width="4" height="10" style="fill:rgba(255,255,255,0.8);stroke-width:2;stroke:#f96332" />
            </svg>
          </button>
          </form>
        </div>
      </div>
    </div>
    `;
  }
  return `
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-secondary sticky-top d-block">
      <div class="container w-100">
        <a class="navbar-brand text-truncate w-50 py-0" data-toggle="collapse" href="${naviObj.home.link}" onclick="$('${naviObj.home.link}').collapse('toggle');">
          ${naviObj.home.name}
        </a>
        ${loggedInHtml}
      </div>
      <div class="container py-0 my-0 text-white d-none d-md-flex justify-content-between">
        <small>${naviObj.school}</small>
        <small>${naviObj.loginname}</small>
      </div>
    </nav>
    <div id="feedback" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm ">
        <div class="modal-content text-center py-3 text-white bg-success">
          ${history.msg} (${history.section} ID: ${history.id})
        </div>
      </div>
    </div>
  `;
}


// Additional Functions

function helperMenuItem (item) {
  let returnHtml = '';
  if (item.dropdown) {
    returnHtml += `
      <div class="nav-item dropdown">
        <a class="nav-link dropdown-toggle text-capitalize" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown">${item.name}</a>
        <div class="dropdown-menu">
          ${item.dropdownItems.map(helperDropdown).join('')}
        </div>
      </div>
    `;
  } else {
    let onClick = '';
    if (item.link.includes('#')) onClick = `data-toggle="collapse" onclick="$('${item.link}').collapse('toggle');"`;
    returnHtml += `
      <div class="nav-item">
        <a class="nav-link text-capitalize" href="${item.link}" ${onClick}>${item.name}</a>
      </div>
    `;
  }
  return returnHtml;
}

function helperDropdown (dropdownItem) {
  let slavePadding = '';
  if (dropdownItem.subCat) slavePadding = ' pl-4';
  let borderTop = '';
  if (dropdownItem.link.includes('new')) borderTop = 'border-top';
  return `
    <div class="nav-item ${borderTop}">
      <a class="nav-link text-capitalize text-dark${slavePadding}" data-toggle="collapse" href="${dropdownItem.link}" onclick="$('${dropdownItem.link}').collapse('toggle');">
        ${dropdownItem.name}
      </a>
    </div>
  `;
}


module.exports = navi;
