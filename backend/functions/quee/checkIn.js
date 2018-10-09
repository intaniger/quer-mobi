const functions = require('firebase-functions');
const Redis = require('ioredis');
const faker = require("Faker");
const Promise = require('bluebird');
const jwt = require('jsonwebtoken')
const cors = require('cors')({
  origin: true,
  credentials:true
});
var admin = require('firebase-admin');
const config = require('../config')

const redis = Promise.promisifyAll(new Redis({port:config.redisPort, host:config.redisHost, password:config.redisPassword}));

const randomAlphanumberic = (nLen, strLen) => faker.Helpers.shuffle(
  [...Array(nLen).keys()].map(()=>faker.random.number(9))
    .concat([...Array(strLen).keys()].map(()=>String.fromCharCode(65+faker.random.number(26))
    ))
).join("");

const parseCookies = (request) => {
  let list = {},
      rc = request.headers.cookie;

  rc && rc.split(';').forEach(( cookie ) => {
      let parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

exports.CheckInQueue = functions.https.onRequest(async(request, response) => {
  //<ReCaptcha></ReCaptcha>
  cors(request, response, ()=>{})
  const userCookie = parseCookies(request)
  const querID = request.query.querID
  let queeID
  if(userCookie.token === undefined){
    queeID = randomAlphanumberic(5,5)
    while (Object.keys(await redis.hgetallAsync(`${queeID}_quee`)).length > 0) {
      queeID = randomAlphanumberic(5,5)
      console.log(queeID)
    }
    response.cookie("token", jwt.sign({queeID},config.jwtSecret,{issuer:"quer-mobi"}), {httpOnly:true, expires: new Date(Date.now() + 1000 * 60 * 60 * 24)})
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
  if(await redis.hgetAsync(`${queeID}_quee`, querID)){
    response.send({success: true, msg:"You have already registered in this Quer", queeID})
    return
  }
  try {
    const snapshot = await db.ref(`${querID}`).once("value")
    if(!snapshot.val()){
      response.send({success: false, msg:"Quer not found."})
    }else{
      redis.hset(`${queeID}_quee`, querID, randomAlphanumberic(6,6))
      db.ref(`${querID}/queue`).push({checkInTimestamp: (new Date()).toISOString(), queeID, serviceTime: -1})
      db.ref(`${querID}/chat/${queeID}`).push({
        message:`Welcome to queue #${querID}, you can talk with quer via this chat.`,
        sender:"bot",
        timestamp: (new Date()).toISOString(),
      })
      if (snapshot.val().announce){
        db.ref(`${querID}/chat/${queeID}`).push({
          message:`[ANNOUNCE] ${snapshot.val().announce}`,
          sender:"quer",
          timestamp: (new Date()).toISOString(),
        })
      }
      response.send({success: true, msg:"Get in line, and wait for a while!", queeID})
    }
  } catch (error) {
    response.send({success: false, msg:"Something went wrong, contact system administrator."})
    console.log(error)
  }
});