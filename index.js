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
const cronController = require('./controllers/cron-controller');
const CronJob = require('cron').CronJob;


// Name the process
process.title = 'homeschool-ds';

const server = new ServerDS('homeschool-ds', 9090);
server.setCallback(router);
server.startServer();

// Cron job for cleaning up chats & messags
const job = new CronJob('0 */10 * * * *', cronController, null, true, 'Europe/Berlin');
job.start();
