const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Player = new Schema
({
   QuestionAnswers: [ ],
   QuizID: Schema.ObjectId,
   CurrentQuestionIndex: Number,
   CorrectAnswers: Number,
   IncorrectAnswers: [ ],
   UserID: Schema.ObjectId,
})

let player = mongoose.model("players",Player);

module.exports = player;
