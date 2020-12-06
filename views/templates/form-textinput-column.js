/*!
 * views/templates/form-textinput-column.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';


function formTextInputColumn (value, prop, required='required') {
  if (prop !== 'id' && prop !== 'classes' && prop !== 'courseColors' && prop !== 'lang') {
    return `
      <label for="${prop}-field" class="col-sm-3 col-form-label text-right mb-2">${prop}</label>
      <div class="col-sm-9">
        <input type="text" class="form-control" id="${prop}-field" name="${prop}" value="${value}" ${required}>
      </div>
    `;
  } else {
    return '';
  }
}


module.exports = formTextInputColumn;
