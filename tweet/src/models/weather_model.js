const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WeatherSchema = new Schema({
  zipcode: String,
  city: String,
  temp: Number,
  desc: String,
  wind: Number,
  humid: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Weather", WeatherSchema);
