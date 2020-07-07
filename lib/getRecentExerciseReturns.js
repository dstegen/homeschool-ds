/*!
 * lib/getRecentExerciseReturns.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

const fs = require('fs');
const path = require('path');


function getRecentExerciseReturns (myGroup) {
  let returnsList = [];
  if (fs.existsSync(path.join(__dirname, '../data/classes', myGroup, 'students'))) {
    let tree = dirTree(path.join(__dirname, '../data/classes', myGroup, 'students'));
    for (var i = 0; i < tree.children.length; i++) {
      //console.log('studentId: '+tree.children[i].name);
      for (var j = 0; j < tree.children[i].children.length; j++) {
        //console.log(tree.children[i].children[j].name+':');
        for (var k = 0; k < tree.children[i].children[j].children.length; k++) {
          let tmpObj = {};
          tmpObj.studentId = tree.children[i].name;
          tmpObj.course = tree.children[i].children[j].name;
          //console.log('lesson: '+tree.children[i].children[j].children[k].name);
          tmpObj.lessonId = tree.children[i].children[j].children[k].name;
          //console.log(tree.children[i].children[j].children[k].children.map( item => { return item.name; }));
          tmpObj.files = tree.children[i].children[j].children[k].children.map( item => { return item.name; });
          returnsList.push(tmpObj);
        }
      }

    }
  }
  return returnsList;
}


// Additional functions

function dirTree(filename) {
    let stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };
    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        info.type = "file";
    }
    return info;
}


module.exports = getRecentExerciseReturns;
