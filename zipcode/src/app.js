const express = require("express");
const Zipcode = require("./models/zipcode_model");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ msg: "zipcode" });
});

app.get("/api/v1/zipcode", async (req, res) => {
  const zipcode = await Zipcode.find({});
  res.json(zipcode);
});

app.get("/api/v1/zipcode/:zipcode", async (req, res) => {
  const zipcode = await Zipcode.find({ zipcode: req.params.zipcode }).sort({
    date: -1
  });
  res.json(zipcode);
});

app.post("/api/v1/zipcode", async (req, res) => {
  const zipcode = new Zipcode({
    zipcode: req.body.name
    // city: city
  });
  const savedZipcode = await zipcode.save();
  res.json(savedZipcode);
});

module.exports = app;
