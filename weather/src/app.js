const express = require("express");
const Weather = require("./models/weather_model");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ msg: "weather" });
});

app.get("/api/v1/weather", async (req, res) => {
  const weather = await Weather.find({});
  res.json(weather);
});

app.get("/api/v1/weather/:zipcode", async (req, res) => {
  const weather = await Weather.find({ zipcode: req.params.zipcode }).sort({
    date: -1
  });
  res.json(weather);
});

app.post("/api/v1/weather", async (req, res) => {
  const apiKey = "904eaa61902dba144dc85f29013ec210";
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${
    req.body.name
  },us&units=imperial&appid=${apiKey}`;

  request(url, async (err, response, body) => {
    if (err) {
      res.json(err);
    } else {
      let data = JSON.parse(body);
      const weather = new Weather({
        zipcode: req.body.name,
        city: data.name,
        temp: data.main.temp,
        desc: data.weather[0].description,
        wind: data.wind.speed,
        humid: data.main.humidity
      });
      const savedWeather = await weather.save();
      res.json(savedWeather);
    }
  });
});

module.exports = app;
