const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  message: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tweet", TweetSchema);
