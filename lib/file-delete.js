/*!
 * lib/file-delete.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/homeschool-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const path = require('path');


function fileDelete (fields) {
	let filePathComplete = path.join(__dirname, '../data/classes', fields.filePath, fields.delfilename);
	if (fs.existsSync(filePathComplete)) {
		try {
			fs.unlinkSync(filePathComplete);
			console.log('- Deleted file: '+fields.delfilename);
			return true;
		} catch (e) {
			console.log('- ERROR deleting file: ' + e);
			return false;
		}
  } else {
		console.log('- ERROR can\'t find file:' + fields.delfilename);
  }
}


module.exports = fileDelete;
