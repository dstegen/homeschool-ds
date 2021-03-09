/*!
 * views/templates/form-checkbox.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';


function formCheckbox (valueArray, prop, checkedArray=[], disabledArray=[]) {
  return `
      <div class="col-sm-2 pt-1 col-form-label text-right">
        ${prop}
      </div>
      <div class="col-sm-7">
        ${valueArray.map( value => helperCheckbox(value, prop, checkedArray, disabledArray)).join('')}
      </div>
  `;
}


// Additional Functions

function helperCheckbox (valueIn, prop, checkedArray, disabledArray) {
  let value = '';
  let label = '';
  if (typeof(valueIn) === 'object') {
    value = valueIn[0];
    label = valueIn[1]
  } else {
    value = valueIn;
    label = valueIn;
  }
  let checked = '';
  if (checkedArray.includes(value)) checked = 'checked';
  let disabled = '';
  if (disabledArray.includes(value)) disabled = 'disabled';
  return `
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="checkbox" name="${prop}" id="${prop}-${value}" value="${value}" ${disabled} ${checked}>
      <label class="form-check-label" for="${prop}-${value}">${label}</label>
    </div>
  `;
}


module.exports = formCheckbox;
