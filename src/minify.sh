#! /bin/bash

#
# npm install uglify-js -g 
#

uglifyjs src/jquery.ajaxchimp.js -o dist/jquery.ajaxchimp.min.js
uglifyjs src/jquery.ajaxchimp.langs.js -o dist/jquery.ajaxchimp.langs.min.js
