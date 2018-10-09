const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp({databaseURL:"https://quer-mobi.firebaseio.com/"});

module.exports = {
  ...require('./quee/checkIn'),
  ...require('./quee/dismissQueue'),
  ...require('./quee/getAuthorizeToken'),
  ...require('./common/chat'),
}