const express = require("express");
const Zipcode = require("./models/zipcode_model");
const Weather = require("./models/weather_model");
const app = express();
const bodyParser = require("body-parser");
const Twit = require("twit");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ msg: "tweet" });
});

app.get("/api/v1/tweet", async (req, res) => {
  const zipcodePromise = Zipcode.find({});
  const weatherPromise = Weather.find({});
  const promises = [zipcodePromise, weatherPromise];
  const [zipcode, weather] = await Promise.all(promises);

  res.json(zipcode.concat(weather));
});

app.post("/api/v1/tweet", async (req, res) => {
  const weather = await Weather.find({ zipcode: req.body.name }).sort({date: -1});
  let data = weather[0];
  const message = `It is ${data.temp} in ${data.city}`;

  const T = new Twit({
    consumer_key: "lZkuaQGAgdbLBJuMVOWsgNSkh",
    consumer_secret: "KGCkLI4tPTArxgDuVpgV25lJ34l5hY4uu9BoVzZiv8YPfJ5ino",
    access_token: "1108469359675084803-SVQapMQPKV2wYIS1iZlbedOCNxrx28",
    access_token_secret: "wEHj7K3KNHwE2oimNqGwwsJXtPrWHranUZShZ834X3nQY"
  });

  T.post("statuses/update", { status: message }, (err, data, response) => {
    if (err) {
      res.json(err);
    } else {
      res.json(data);
    }
  });
});

module.exports = app;
