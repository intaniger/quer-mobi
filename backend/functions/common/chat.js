const functions = require('firebase-functions');
const Redis = require('ioredis');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken')
const cors = require('cors')({
  origin: true,
  credentials:true
});
var admin = require('firebase-admin');
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

exports.AddMessage = functions.https.onRequest(async(request, response) => {
  //<ReCaptcha></ReCaptcha>
  cors(request, response, ()=>{})

  const userCookie = parseCookies(request)
  const querID = request.body.querID
  const message = request.body.message
  const db = admin.database()

  let queeID
  if(userCookie.token === undefined){
    response.send({success: false, msg:"Unauthorized user."})
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
  if(await redis.hgetAsync(`${queeID}_quee`, querID)){
    try {
      db.ref(`${querID}/chat/${queeID}`).push({
        message,
        sender:"quee",
        timestamp: (new Date()).toISOString(),
      })
      response.send({success: true, msg:""})
    } catch (error) {
      response.send({success: false, msg:"Something went wrong, contact system administrator."})
      console.error(error)
    }
    return
  }
  // @todo #5:1hr chat API for quer
});