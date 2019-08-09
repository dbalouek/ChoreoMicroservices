const express = require("express");
const Tweet = require("./models/tweet_model");
const Weather = require("./models/weather_model");
const app = express();
const bodyParser = require("body-parser");
const Twit = require("twit");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ msg: "tweet" });
});

app.get("/api/v1/tweet", async (req, res) => {
  const tweet = await Tweet.find({});
  res.json(tweet);
});

app.post("/api/v1/tweet", async (req, res) => {
  const weather = await Weather.find({ zipcode: req.body.name }).sort({
    date: -1
  });
  let data = weather[0];
  const message = `It is ${data.temp} degrees in ${data.city}`;

  const T = new Twit({
    consumer_key: "lZkuaQGAgdbLBJuMVOWsgNSkh",
    consumer_secret: "KGCkLI4tPTArxgDuVpgV25lJ34l5hY4uu9BoVzZiv8YPfJ5ino",
    access_token: "1108469359675084803-SVQapMQPKV2wYIS1iZlbedOCNxrx28",
    access_token_secret: "wEHj7K3KNHwE2oimNqGwwsJXtPrWHranUZShZ834X3nQY"
  });

  T.post(
    "statuses/update",
    { status: message },
    async (err, data, response) => {
      if (err) {
        res.json(err);
      } else {
        const tweet = new Weather({
          message: message
        });
        const savedTweet = await tweet.save();
        res.json(data);
      }
    }
  );
});

module.exports = app;
