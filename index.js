/*!
 * index.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const { ServerDS, ServerDSS } = require('webapputils-ds');
const router = require('./controllers/router');
const cronController = require('./main/cron-controller');
const CronJob = require('cron').CronJob;


// Name the process
process.title = 'homeschool-ds';

// Set defaults, 0 = take all available internet interfaces
let serverIp = '0';
let serverPort = 9090

// Use SSL if available
let ssl = {};
try {
  const serverconf = require('./serverconf');
  ssl.key = fs.readFileSync(serverconf.keyFile).toString();
  ssl.cert = fs.readFileSync(serverconf.certFile).toString();
  if (serverconf.serverIp && serverconf.serverIp !== '') serverIp = serverconf.serverIp;
  if (serverconf.serverPort && typeof(serverconf.serverPort) === 'number') serverPort = serverconf.serverPort;
} catch (e) {
  console.log('- No serverconf found, using defaults!');
}


if (ssl.key && ssl.cert) {
  const server = new ServerDSS('homeschool-ds', serverPort, serverIp, ssl);
	server.setCallback(router);
	server.startServer();
} else {
  const server = new ServerDS('homeschool-ds', serverPort, serverIp);
  server.setCallback(router);
  server.startServer();
}


// Cron job for cleaning up chats & messags
const job = new CronJob('0 */30 * * * *', cronController, null, true, 'Europe/Berlin');
job.start();
