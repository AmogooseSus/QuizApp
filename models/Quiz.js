const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Quiz = new Schema(
  {
    CategoryID: Number,
    CategoryName: String,
    QuestionAnswers: [ ],
    Difficulty: String,
    Points: Number,
    Coins: Number,
  })

let quiz = mongoose.model("quiz",Quiz);

module.exports = quiz;
