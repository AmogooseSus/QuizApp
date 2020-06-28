const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CQuiz = new Schema(
  {
    UserID: Schema.ObjectId,
    QuestionAnswers: [ ],
    Title: String,
    AmountPlayed: Number
  })

let cquiz = mongoose.model("Cquiz",CQuiz);

module.exports = cquiz;
