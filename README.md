# ChoreoMicroservices

## How does it work
The three microservices are all different cloud functions in firebase.

An API is exposed to be able to POST a zipcode. This zipcode is stored in firestore's noSQL database. 

Another cloud function triggers once this data written which makes a request to the OpenWeather API and retrieves weather data. The temperature along with the name of the city is stored in firestore.

The final cloud function triggers when the weather data is written. This function uses the data and sends a tweet out using https://RapidAPI.com

## Other Features of Firebase
- Caching behavior for dynamic content -> we can cache the weather data rather than make a new OpenWeather request every time
- Firebase Performance Monitoring -> automatically measure https requests' response times, payload sizes, and success rates