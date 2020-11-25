/*!
 * views/templates/files-list.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';


function filesList (files, urlPath='', group='', studentId='', lessonId='', lessonColor='', deleteable=false) {
  let returnHtml = '';
  if (files && files.length > 0) {
    returnHtml += `<ul>`;
    files.forEach( filePath => {
      let delButton = '';
      let tmpFile = filePath.split('/').pop();
      if (deleteable) {
        delButton = `
          <form id="delform-${tmpFile.split('.')[0]}" action="/filedelete" method="post" enctype="multipart/form-data">
            <input type="text" readonly class="d-none" id="filePath" name="filePath" value="${filePath}">
            <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="${urlPath}">
            <input type="text" readonly class="d-none" id="group" name="group" value="${group}">
            <input type="text" readonly class="d-none" id="studentId" name="studentId" value="${studentId}">
            <input type="text" readonly class="d-none" id="lessonId" name="lessonId" value="${lessonId}">
            <a href="#" class="${lessonColor} mr-2" onclick="fileDelete('delform-${tmpFile.split('.')[0]}')">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </a>
          </form>
        `;
      }
      returnHtml += `
        <li>
          <div class="d-flex justify-content-between">
            <a href="${filePath}" class="${lessonColor}" target="_blank">
              ${tmpFile}
            </a>
            ${delButton}
          </div>
        </li>
      `;
    });
    returnHtml += `</ul>`;
  }
  return returnHtml;
}


module.exports = filesList;
