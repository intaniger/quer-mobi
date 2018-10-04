const functions = require('firebase-functions');
const Redis = require('ioredis');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken')
const cors = require('cors')({
  origin: true,
  credentials: true
});
var admin = require('firebase-admin');

var FieldValue = require('firebase-admin').firestore.FieldValue;

const config = require('../config')

const redis = Promise.promisifyAll(new Redis({port:config.redisPort, host:config.redisHost, password:config.redisPassword}));

const parseCookies = (request) => {
  let list = {},
      rc = request.headers.cookie;

  rc && rc.split(';').forEach(( cookie ) => {
      let parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

exports.CheckOutQueue = functions.https.onRequest(async(request, response) => {
  //<ReCaptcha></ReCaptcha>
  cors(request, response, ()=>{})
  const userCookie = parseCookies(request)
  let queeID
  if(userCookie.token === undefined){
    response.send({success: false, msg:"Unknown quee."})
  }else{
    jwt.verify(userCookie.token, config.jwtSecret, (err, decode)=>{
      if(err){
        response.status(403)
        return
      }else{
        queeID = decode.queeID
      }
    })
  }
  const db = admin.database()
  if((await redis.hdel(`${queeID}_quee`, request.query.querID)) === 0){
    response.send({success: false, msg:"You haven't registered in this Quer yet."})
    return
  }
  try {
    const snapshot = await db.ref(`${request.query.querID}/queue`).once("value")
    if(!snapshot.val()){
      response.send({success: false, msg:"Quer not found."})
    }else{
      snapshot.forEach((quee)=>{
        if(quee.val().queeID  === queeID){
          db.ref(`${request.query.querID}/queue`).update({
            [quee.key]: FieldValue.delete(),
          })
          db.ref(`${request.query.querID}/chat`).update({
            [queeID]: FieldValue.delete(),
          })
        }
      })
      response.send({success: true, msg:"Get out of line!"})
    }
  } catch (error) {
    response.send({success: false, msg:"Something went wrong, contact system administrator."})
    console.log(error)
  }
});