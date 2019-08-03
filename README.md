# ChoreoMicroservices

## Setting Up

Install Docker as well as the three required images: [node](https://hub.docker.com/_/node) |
[nginx](https://hub.docker.com/_/nginx) | [mongo](https://hub.docker.com/_/mongo)

CD to the project dir and build the containers `docker-compose build`

Run the containers `docker-compose up -d`

## Running

The UI is located at http://localhost:8080/ (doesn't work that well right now)

**GET** Request to http://localhost:8080/api/v1/zipcode will return all the inputted zipcodes

**GET** Request to http://localhost:8080/api/v1/weather will return all the inputted weather

_you can also query for a specific zipcode by adding /{zipcode} after the URL for the GET requests_

**POST** Request to http://localhost:8080/api/v1/zipcode will add a new zipcode to the database

**POST** Request to http://localhost:8080/api/v1/weather will add the zipcode's current weather to the database

**POST** Request to http://localhost:8080/api/v1/tweet will tweet the most recently added weather for the zip code

**POST** Requests must formatted as follows: `{"name": "{zipcode}"}`

## How does it work

The three microservices and the webpage are all running in their own docker containers with their own respective ports.
The wepbage is on 3000, tweet service on 3001, zipcode service on 3002, and the weather service on 3003.

The nginx server on port 8080 acts as a proxy to run all the services under one port. The details are in `default.conf`.

The zipcode service just adds the zipcodes to MongoDB. It isn't useful because I didn't want to break it up too much.

The weather service makes a request to the OpenWeather API and retrieves weather data. The name of the city,
temperature, description, wind speed, and humidity are all stored in MongoDB.

The tweet service searches MongoDB for matches to the zipcode entered. If it finds something, it will tweet out
the most recent log of that zipcode's weather by using [Twit](https://www.npmjs.com/package/twit).
The tweets can be found at [@LunchboxScience](https://twitter.com/LunchboxScience)

## TODO

- Fix errors with wrong invalid zipcodes
- Fix the UI
