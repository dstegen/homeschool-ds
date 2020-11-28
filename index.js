/*!
 * index.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { ServerDS } = require('webapputils-ds');
const router = require('./controllers/router');

// Name the process
process.title = 'homeschool-ds';

const server = new ServerDS('homeschool-ds', 9090);
server.setCallback(router);
server.startServer();
