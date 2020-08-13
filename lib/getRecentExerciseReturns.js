/*!
 * lib/getRecentExerciseReturns.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const path = require('path');


function getRecentExerciseReturns (myGroup, courses=['all']) {
  let returnsList = [];
  if (fs.existsSync(path.join(__dirname, '../data/classes', myGroup, 'courses'))) {
    let tree = dirTree(path.join(__dirname, '../data/classes', myGroup, 'courses'));
    for (var i = 0; i < tree.children.length; i++) {
      //console.log('lesson: '+tree.children[i].name);
      for (var j = 0; j < tree.children[i].children.length; j++) {
        //console.log('lessonId: '+tree.children[i].children[j].name);
        for (var k = 0; k < tree.children[i].children[j].children[0].children.length; k++) {
          if (courses[0] === 'all' || courses.includes(tree.children[i].name)) {
            let tmpObj = {};
            tmpObj.studentId = tree.children[i].children[j].children[0].children[k].name;
            tmpObj.course = tree.children[i].name;
            //console.log('studentId: '+tree.children[i].children[j].children[0].children[k].name);
            tmpObj.lessonId = tree.children[i].children[j].name;
            //console.log(tree.children[i].children[j].children[0].children[k].children.map( item => { return item.name; }));
            if (tree.children[i].children[j].children[0].children[k].children) {
              tmpObj.birthtime = tree.children[i].children[j].children[0].children[k].children[0].birthtime;
              tmpObj.files = tree.children[i].children[j].children[0].children[k].children.map( item => { return item.name; });
            } else {
              tmpObj.files = [];
            }
            returnsList.push(tmpObj);
          }
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
            name: path.basename(filename),
            birthtime: stats.birthtime
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
