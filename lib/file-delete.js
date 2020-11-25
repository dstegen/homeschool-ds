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
	let filePathComplete = path.join(__dirname, '../', fields.filePath);
	let delfilename = fields.filePath.split('/').pop();
	if (fields.delfilename && fields.delfilename !== '') {
		filePathComplete = path.join(__dirname, '../data/classes', fields.filePath, fields.delfilename);
		delfilename = fields.delfilename;
	}
	if (fs.existsSync(filePathComplete)) {
		try {
			fs.unlinkSync(filePathComplete);
			console.log('- Deleted file: '+delfilename);
			return true;
		} catch (e) {
			console.log('- ERROR deleting file: ' + e);
			return false;
		}
  } else {
		console.log('- ERROR can\'t find file:'+delfilename);
  }
}


module.exports = fileDelete;
