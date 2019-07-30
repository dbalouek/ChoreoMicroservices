const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request');
const Twit = require('twit');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

exports.addZip = functions.https.onRequest(async (req, res) => {
    const input = req.query.text;
    let FieldValue = require('firebase-admin').firestore.FieldValue;
    let oldZip = db.collection('zips').doc(input).get()
      .then(doc => {
        if(doc.exists) {
          const oldDate = doc.data().timestamp.toDate();
          var FIVE_MIN = 5 * 60 * 1000; /* ms */
          if(((new Date) - oldDate) > FIVE_MIN || input === 'awake') {
            let newZip = db.collection('zips').doc(input).set({
              zip_code: input,
              timestamp: FieldValue.serverTimestamp()
            });
          } else {
            console.log('There is a cooldown on '+doc.id);
          }
        } else {
          let newZip = db.collection('zips').doc(input).set({
            zip_code: input,
            timestamp: FieldValue.serverTimestamp()
          });
        }
        return null;
      })
      .catch(err => {
        console.log('error:', err);
      });
    res.status(200).send('ok');
  });

exports.addWeather = functions.firestore
  .document('zips/{zipcode}')
  .onWrite((change, context) => {
      const newValue = change.after.data();
      const apiKey = '904eaa61902dba144dc85f29013ec210';
      const zipcode = newValue.zip_code;
      const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&units=imperial&appid=${apiKey}`; 
      let FieldValue = require('firebase-admin').firestore.FieldValue;
      
      if(zipcode === 'awake') {
        let awake = db.collection('weather').doc('awake').set({
          timestamp: FieldValue.serverTimestamp()
        });
      } else {
        return new Promise((resolve, reject) => {
          request(url, (err, response, body) => {
          if(err){
            console.log('error:', err);
            reject(Error('Could not get weather'));
          } else {
            let weather = JSON.parse(body);
            try {
              let newWeather = db.collection('weather').doc(zipcode).set({
                city: weather.name,
                temp: weather.main.temp,
                timestamp: FieldValue.serverTimestamp()
              });
              console.log('body:', body);
            } catch(err){
              console.log('error:', weather.message);
            }
            resolve();
          }
          });
        });
      }
      return 0;
  });

exports.tweet = functions.firestore
  .document('weather/{weather}')
  .onWrite((change, context) => {
    const newValue = change.after.data();

    if(newValue.temp && newValue.city) {
      const message = `It is ${newValue.temp} degrees in ${newValue.city}`;
      var T = new Twit({
        consumer_key:         'lZkuaQGAgdbLBJuMVOWsgNSkh',
        consumer_secret:      'KGCkLI4tPTArxgDuVpgV25lJ34l5hY4uu9BoVzZiv8YPfJ5ino',
        access_token:         '1108469359675084803-SVQapMQPKV2wYIS1iZlbedOCNxrx28',
        access_token_secret:  'wEHj7K3KNHwE2oimNqGwwsJXtPrWHranUZShZ834X3nQY'
      });
      T.post('statuses/update', { status: message }, (err, data, response) => {
        if(err){
          console.log('error:', err)
        } else {
          console.log(data)
        }
      });
    }
    return 0;
  });