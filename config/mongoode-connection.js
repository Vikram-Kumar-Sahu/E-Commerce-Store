const mongoose = require('mongoose');
const config = require("config");

const debug = require("debug")("development:mongoose");


mongoose
  .connect(`${config.get("MONGODB_URL")}/shop1`)
  .then(function () {
    debug("Connected to MongoDB");
  })
  .catch(function (err) {
    console.error("Connection error:", err);
  });

module.exports = mongoose.connection;
