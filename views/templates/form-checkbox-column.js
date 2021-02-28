/*!
 * views/templates/form-checkbox-column.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';


function formTextInputColumn (valueArray, prop, checkedArray=[], disabledArray=[]) {
  return `
    <div class="w-100"></div>
    <div class="col-12 px-4 row form-${prop}">
      <div class="col-sm-3 pt-1 col-form-label text-right">
        ${prop}
      </div>
      <div class="col-sm-9">
        ${valueArray.map( value => helperCheckbox(value, prop, checkedArray, disabledArray)).join('')}
      </div>
    </div>
  `;
}


// Additional Functions

function helperCheckbox (value, prop, checkedArray, disabledArray) {
  let checked = '';
  if (checkedArray.includes(value)) checked = 'checked';
  let disabled = '';
  if (disabledArray.includes(value)) disabled = 'disabled';
  return `
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="checkbox" name="${value}" id="${prop}-${value}" value="true" ${disabled} ${checked}>
      <label class="form-check-label" for="${prop}-${value}">${value}</label>
    </div>
  `;
}


module.exports = formTextInputColumn;
