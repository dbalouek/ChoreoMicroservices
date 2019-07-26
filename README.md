# ChoreoMicroservices

## How does it work
The three microservices are all different cloud functions in firebase.

An API is exposed to be able to send a zipcode through a url header. This zipcode is stored in firestore's noSQL database. 

Another cloud function triggers once this data written which makes a request to the OpenWeather API and retrieves weather data. The temperature along with the name of the city is stored in firestore.

The third and final cloud function triggers when the weather data is written. This function uses the data and sends a tweet out using the npm package twit. The tweets can be found at [@LunchboxScience](https://twitter.com/LunchboxScience)

## Benchmarks

- getZip function takes 4ms
- getWeather function takes 150-250ms
- tweet function takes 8ms