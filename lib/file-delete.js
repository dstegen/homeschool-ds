/*!
 * lib/file-delete.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const path = require('path');


function fileDelete (fields) {
	let history = {};
	if (fs.existsSync(path.join(__dirname, '../data/classes', fields.group, fields.filePath, fields.delfilename))) {
		try {
			//fs.unlinkSync(path.join(__dirname, '../data/classes', fields.group, fields.filePath, fields.delfilename));
			history.msg = 'DELETE successful!';
			history.id = fields.delfilename;
			console.log('- Deleted file: '+fields.delfilename);
		} catch (e) {
			history.msg = '- ERROR' + e;
			console.log(history.msg);
		}
  } else {
    history.msg = '- ERROR can\'t find file:' + fields.delfilename;
		console.log(history.msg);
  }
  return history;
}


module.exports = fileDelete;
