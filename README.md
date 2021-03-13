# HomeSchool-DS #
#### Simple HomeSchool Server by Daniel Stegen ####

## Introduction ##

A simple HomeSchool server for teachers and students to have a better overview of what is to do and what is already done in a homeschool environment during Covid-19 lockdown situations.

## Features ##

- NEW: Online lessons with Jitsi Meet video conference, chalkboard, document viewer & youtube video display
- Teachers can setup lessons, provide download material and receive returned homework uploads from the students.
- Students get a weekly and daily overview of what to do, can finish a lesson by clicking a button and can upload homework.
- HomeSchool-DS includes a basic class/group-chat, as well as a private message from teachers to students and students to teachers.
- It also includes a group board for additional informations or alternative display of lessons

## Important notice ##
***At the moment HomeSchool-DS is more a "proof-of-concept" project and not ready for production!***

#### Missing features: ####
- Database support (currently only *.json files)
- Secure privacy support (all saved data is unencrypted)
- Scaleabilty (currently everything runs in one process)
- Documentation & HowTos


## Installation ##

1. Download **homeschool-ds.zip**

2. Unzip homeschool-ds.zip into your project directory

   ```
   unzip homeschool-ds.zip -d ./homeschool-ds
   ```

3. Change into the **homeschool-ds** directory and install the dependencies

   ```
   cd homeschool-ds
   npm install
   ```

4. Start homeschool-ds within the **homeschool-ds** directory with the command:

   ```
   npm start
   ```


## Changelog ##

#### v0.4.1 ####
- added basic sanitizer for sanitize form inputs
- limit edit access on boards to class teacher
- refactored user:teacher, added leader property
- removed node-viewerjs, too much overhead
- added some tooltips

#### v0.4.0 ####
- added classroom for online lessons
- added Jitsi video-meeting in classroom
- added variable chalkboard with exchangeable background in classroom
- added PDF, JPEG & PNG document viewer in classroom
- integrated online lessons in timetable, day view and board
- improved visualization in timetable, day view and board
- improved lessons planing & data structure
- better server configuration via serverconf.json
- bug fixes, code cleanups & code improvements

#### v0.3.8 ####
- added optional ssl support
- added filter lessons
- updated dependencies
- added cronjob for cleaning up chats & messages
- refactored admin views
- bugfixes & code cleanup

#### v0.3.7 ####
- major refactored views
- made board columns sortable
- added cron job for cleaning chats & messages
- several bug fixes & minor improvements

#### v0.3.6 ####
- major refactored router+controller
- introduced separate controllers
- improved routing and url-workflows
- refactored boards
- refactored file up-/download & delete

#### v0.3.5 ####
- introduced group boards
- introduced admin mode
- made up-/download-files access easier
- added update password for users
- several bug fixes and improvements

#### v0.3.4 ####
- added locale for en + de
- major refactoring and code cleanup


## License ##

The MIT License (MIT)

Copyright (c) 2021 Daniel Stegen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Author: Daniel Stegen

Email: info@danielstegen.de
