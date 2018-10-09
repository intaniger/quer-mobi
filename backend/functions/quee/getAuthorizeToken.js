const functions = require('firebase-functions');
const Redis = require('ioredis');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken')
const cors = require('cors')({
  origin: true,
  credentials:true
});
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

exports.GetAuthToken = functions.https.onRequest(async(request, response) => {
  //<ReCaptcha></ReCaptcha>
  cors(request, response, ()=>{})

  const userCookie = parseCookies(request)
  const querID = request.query.querID

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
  let authToken = await redis.hgetAsync(`${queeID}_quee`, querID)
  if(authToken){
    response.send({success: true, authToken})
  }else{
    response.status(403)
  }
});