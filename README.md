# ChoreoMicroservices

## How does it work
The three microservices are all different cloud functions in firebase.

An API is exposed to be able to send a zipcode through a url header. This zipcode is stored in firestore's noSQL database.
`curl https://us-central1-weather-microservice-d9385.cloudfunctions.net/addZip?text={ZIP_CODE}`

Another cloud function triggers once this data written which makes a request to the OpenWeather API and retrieves weather data. The temperature along with the name of the city is stored in firestore.

The third and final cloud function triggers when the weather data is written. This function uses the data and sends a tweet out using the npm package [Twit](https://www.npmjs.com/package/twit). The tweets can be found at [@LunchboxScience](https://twitter.com/LunchboxScience)

There is also a cloud scheduler which is basically a cron job. The job runs the all the microservices once a minute with dummy data to keep the functions warm and prevent a cold start.

To prevent spam and overloads, the service only fulfills requests every 5 minutes for each zip code. The OpenWeather API has a limit of 60 requests per minute, once that limit is reached, zip codes will be logged, but the weather will not update or be tweet. The Twitter API also has a limit of 2400 tweets per day with a three hour limit of 300 tweets. Once a limit is reached, the system will update its database but will not tweet weather.

## Metrics

- [Memory Usage](https://public.google.stackdriver.com/public/chart/17509575532610556248?drawMode=color&showLegend=true&theme=light)
- [Document Reads](https://public.google.stackdriver.com/public/chart/6945007395628257807?drawMode=color&showLegend=true&theme=light)
- [Document Writes](https://public.google.stackdriver.com/public/chart/1771319374688607598?drawMode=color&showLegend=true&theme=light)
- [Total Service Execution Time](https://public.google.stackdriver.com/public/chart/16488086371681480029?drawMode=color&showLegend=true&theme=light)
- [Function Execution Times](https://public.google.stackdriver.com/public/chart/6326970280502208863?drawMode=color&showLegend=true&theme=light)
- [Memory Usage](https://public.google.stackdriver.com/public/chart/17509575532610556248?drawMode=color&showLegend=true&theme=light)
- [Errors](https://public.google.stackdriver.com/public/chart/1714671653279637767?drawMode=color&showLegend=true&theme=light)

## Warm Benchmarks

- getZip function takes <10ms
- getWeather function takes 200ms
- tweet function takes <10ms

## Cold Benchmarks

- getZip function takes 500ms
- getWeather function takes 300ms
- tweet function takes 100ms
- dependencies and global variables add on which result in two minute wait
