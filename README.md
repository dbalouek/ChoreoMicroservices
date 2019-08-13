# ChoreoMicroservices

## Connecting to Chameleon Cloud

Start an SSH tunnel to the instance: `ssh -L 8080:localhost:8080 cc@{FLOATING_IP_ADDR}`

Install git: `sudo yum install git`

[Ubuntu]
Install docker, docker-compose, docker.io packages

Clone the repo and checkout the 'express' branch:

```
git clone https://github.com/dbalouek/ChoreoMicroservices.git
git checkout express
```

then run the [install.sh](https://github.com/dbalouek/ChoreoMicroservices/blob/express/install.sh) script `./install.sh`

The script sets up compose and runs the containers so there is no need to do anything else.

## Setting Up with Compose

Install Docker as well as the three required images: [node](https://hub.docker.com/_/node) |
[nginx](https://hub.docker.com/_/nginx) | [mongo](https://hub.docker.com/_/mongo)

CD to the project dir and build the containers: `docker-compose build`

Run the containers: `docker-compose up -d`

## Setting Up with Swarm

Still need to install Docker as well as the three required images: [node](https://hub.docker.com/_/node) |
[nginx](https://hub.docker.com/_/nginx) | [mongo](https://hub.docker.com/_/mongo)

Build each service:

```
docker build -t web -f web/Dockerfile web
docker build -t zipcode -f zipcode/Dockerfile zipcode
docker build -t weather -f weather/Dockerfile weather
docker build -t tweet -f tweet/Dockerfile tweet
```

Initialize and deploy the stack:

```
docker swarm init
docker stack deploy -c ./docker-stack.yml microservice
```

To tear down the stack:

```
docker stack rm microservice
docker swarm leave --force
```

## Running

The UI is located at http://localhost:8080

Visualizer to see where the containers are running is located at http://localhost:9000 (only if using swarm)

[API Docs](https://documenter.getpostman.com/view/6820223/SVYrsJcX?version=latest#42887a5e-6962-4219-9283-b5b21f3a393a)

**GET** Request to http://localhost:8080/api/v1/zipcode will return all the inputted zipcodes

**GET** Request to http://localhost:8080/api/v1/weather will return all the inputted weather

_you can also query for a specific zipcode by adding /{zipcode} after the URL for the GET requests_

**POST** Request to http://localhost:8080/api/v1/zipcode will add a new zipcode to the database

**POST** Request to http://localhost:8080/api/v1/weather will add the zipcode's current weather to the database

**POST** Request to http://localhost:8080/api/v1/tweet will tweet the most recently added weather for the zip code

**POST** Requests must formatted as follows: `{"name": "<zipcode>"}`

## How does it work

The three microservices and the webpage are all running in their own docker containers with their own respective ports.
The wepbage is on 3000, tweet service on 3001, zipcode service on 3002, and the weather service on 3003.

The nginx server on port 8080 acts as a proxy to run all the services under one port. The details are in [default.conf](https://github.com/dbalouek/ChoreoMicroservices/blob/express/default.conf)

The zipcode service just adds the zipcodes to MongoDB. It isn't useful because I didn't want to break it up too much.

The weather service makes a request to the OpenWeather API and retrieves weather data. The name of the city,
temperature, description, wind speed, and humidity are all stored in MongoDB.

The tweet service searches MongoDB for matches to the zipcode entered. If it finds something, it will tweet out
the most recent log of that zipcode's weather by using [Twit](https://www.npmjs.com/package/twit).
The tweets can be found at [@LunchboxScience](https://twitter.com/LunchboxScience)

When running the services using swarm, there are replicas of some of the services. This is for high availability so that if one container goes down, there is still a backup running while the container restarts. This way, it will appear as if there was no downtime.

Swarm also gives us horizontal scaling. If the service gets a ton of traffic one day, then we can create replicas to meet the demand. This way, we are only using resources we need to avoid sitting near idle and wasting money.

## TODO

- Fix errors with wrong invalid zipcodes
