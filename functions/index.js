const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

app.post('/zips', async (req, res) => {
    const zip = req.body.message;
    try {
        res.status(201).json({message: zip});
    } catch(error) {
        console.log('Error logging the zip code', error.message);
        res.sendStatus(500);
    }
});

exports.newZip = functions.firestore
    .document('zips/{zipcode}')
    .onCreate((snap, context) => {
        const newValue = snap.data()
        const zip = context.params.zipcode;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.openweathermap.org/data/2.5/weather?zip="+str(zip)+",us&units=imperial&appid=904eaa61902dba144dc85f29013ec210", true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let json = JSON.parse(xhr.responseText);
                    const temp = json.main.temp;
                    // upload temp to firestore
                }
            }
        }
        xhr.send(null);        
    });

exports.newWeather = functions.firestore
    .document('weather/{zipcode}')
    .onCreate((snap, context) => {
        const newValue = snap.data()
        const city = newValue.name;
        const temp = newValue.temp;
        const zip = context.params.zipcode;
        // make tweet here  https://blog.rapidapi.com/how-to-use-the-twitter-api-with-javascript/
    });

app.get('/zips', async (req, res) => {
    let query = admin.database().ref(`/zips`);

    try {
        const snapshot = await query.once('value');
        let zips = [];
        snapshot.forEach((childSnapshot) => {
            zips.push({key: childSnapshot.key, message: childSnapshot.val().message});
        });

        res.status(200).json(zips);
    } catch(error) {
        console.log('Error getting zip codes', error.message);
        res.sendStatus(500);
    }
});

// app.get('/zips/{zipcode}', async (req, res) => {
//     const zipcode = req.params.zipcode;
//     try {
//         const snapshot = await admin.database().ref(`/zips/${zipcode}`).once('value');
//         if (!snapshot.exists()) {
//             return res.status(404).json({errorCode: 404, errorMessage: `message '${zipcode}' not found`});
//         }
//         return res.set('Cache-Control', 'private, max-age=300');
//     } catch(error) {
//         console.log('Error getting zipcode', zipcode, error.message);
//         return res.sendStatus(500);
//     }
// });
  
exports.api = functions.https.onRequest(app);
