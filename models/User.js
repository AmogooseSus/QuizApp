const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema(
  {
    Email: String,
    Username: String,
    Password: String,
    Verified: Boolean,
    Coins: Number,
    CQuizzes: [Schema.ObjectId],
    CQuizSlots: Number,
    Points: Number,
    Friends: [Schema.ObjectId],
    FriendRequests: [Schema.ObjectId],
    CompletedQuizzes: [Schema.ObjectId],
    CategoriesUnlocked: [ ],
  })

let user = mongoose.model("user",User);

module.exports = user;
