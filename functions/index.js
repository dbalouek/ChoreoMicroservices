const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

exports.addZip = functions.https.onRequest(async (req, res) => {
    const input = req.query.text;
    let newZip = db.collection('zips').add({
        zip_code: input
    });
    res.redirect(200);
  });

exports.addWeather = functions.firestore
  .document('zips/{zipcode}')
  .onCreate((snap, context) => {
      const newValue = snap.data();
      const apiKey = '904eaa61902dba144dc85f29013ec210';
      const zipcode = newValue.zip_code;
      const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&units=imperial&appid=${apiKey}`; 

      return new Promise((resolve, reject) => {
        request(url, (err, response, body) => {
        if(err){
          console.log('error:', error);
        } else {
          console.log('body:', body);
          let weather = JSON.parse(body);
          let newWeather = db.collection('weather').doc(zipcode).set({
            city: weather.name,
            temp: weather.main.temp
          });
          resolve();
        }
        });
      });
  });