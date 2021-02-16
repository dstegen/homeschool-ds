/*!
 * views/templates/tail.js
 * homeschool-ds (https://github.com/dstegen/homeschool-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';


function tail () {
  return `
        </div>
        <!-- Footer -->
        <div class="footer">
          <div class="small bg-secondary text-light text-center pt-4 pb-4">
            &copy; 2021 by Daniel Stegen
          </div>
        </div>
      </div>
      <!-- jQuery first, then Bootstrap JS -->
        <script src="/node_modules/jquery/dist/jquery.min.js"></script>
        <script src="/node_modules/jquery-ui-dist/jquery-ui.min.js"></script>
        <script src="/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="/node_modules/bs-custom-file-input/dist/bs-custom-file-input.min.js"></script>
      <!-- Other Scripts -->
        <script src="/public/clock.js"></script>
        <script src="/public/cookie.js"></script>
        <script src="/public/scripts.js"></script>
    </body>
  </html>`;
}


module.exports = tail;
