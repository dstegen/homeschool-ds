/*!
 * views/templates/form-select-column.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';


function formSelectColumn (optionsList, value, prop, onchange) {
  return `
    <label for="${prop}-field" class="col-sm-3 col-form-label text-right">${prop}</label>
    <div class="col-sm-9 mb-2">
      <select class="form-control form-control-sm" id="${prop}-field" name="${prop}" required ${onchange}>
        ${optionsList.map( item => helperSelectOption(item, value) ).join('')}
      </select>
    </div>
  `;
}


// Additional functions

function helperSelectOption (item, value) {
  let myValue = item;
  if (typeof(item) === 'object') {
    myValue = item[0];
    item = item[1];
  }
  let selected = '';
  if (value.includes(item)) selected = 'selected'
  return `
    <option ${selected} value="${myValue}">${item}</option>
  `;
}


module.exports = formSelectColumn;
