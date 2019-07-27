const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request');
const Twit = require('twit');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

exports.addZip = functions.https.onRequest(async (req, res) => {
    const input = req.query.text;
    let FieldValue = require('firebase-admin').firestore.FieldValue;
    let newZip = db.collection('zips').doc(input).set({
        zip_code: input,
        timestamp: FieldValue.serverTimestamp()
    });
    res.redirect(200);
  });

exports.addWeather = functions.firestore
  .document('zips/{zipcode}')
  .onWrite((change, context) => {
      const newValue = change.after.data();
      const apiKey = '904eaa61902dba144dc85f29013ec210';
      const zipcode = newValue.zip_code;
      const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&units=imperial&appid=${apiKey}`; 

      return new Promise((resolve, reject) => {
        request(url, (err, response, body) => {
        if(err){
          console.log('error:', err);
        } else {
          console.log('body:', body);
          let weather = JSON.parse(body);
          let FieldValue = require('firebase-admin').firestore.FieldValue;
          let newWeather = db.collection('weather').doc(zipcode).set({
            city: weather.name,
            temp: weather.main.temp,
            timestamp: FieldValue.serverTimestamp()
          });
          resolve();
        }
        });
      });
  });

exports.tweet = functions.firestore
  .document('weather/{weather}')
  .onWrite((change, context) => {
    const newValue = change.after.data();
    const message = `It is ${newValue.temp} degrees in ${newValue.city}`;
    var T = new Twit({
      consumer_key:         'lZkuaQGAgdbLBJuMVOWsgNSkh',
      consumer_secret:      'KGCkLI4tPTArxgDuVpgV25lJ34l5hY4uu9BoVzZiv8YPfJ5ino',
      access_token:         '1108469359675084803-SVQapMQPKV2wYIS1iZlbedOCNxrx28',
      access_token_secret:  'wEHj7K3KNHwE2oimNqGwwsJXtPrWHranUZShZ834X3nQY'
    });
    return T.post('statuses/update', { status: message }, (err, data, response) => {
      if(err){
        console.log('error:', err)
      } else {
        console.log(data)
      }
    });
  });