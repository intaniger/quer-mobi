const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp({databaseURL:"https://quer-mobi.firebaseio.com/"});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
module.exports = {
  ...require('./quee/checkIn'),
  ...require('./quee/dismissQueue'),
}