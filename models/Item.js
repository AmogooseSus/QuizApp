const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Item = new Schema(
  {
    ItemName: String,
    ItemPrice: Number,
    ItemDescription: String,
    ItemType: String,
    ItemData: [ ],
  })

let item = mongoose.model("item",Item);

module.exports = item;
