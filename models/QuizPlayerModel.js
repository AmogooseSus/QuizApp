const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Player = new Schema
({
  Instance: Object,
})

let player = mongoose.model("players",Player);

module.exports = player;
