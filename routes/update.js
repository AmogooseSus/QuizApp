const express = require("express");
const router = express.Router();
const itemHandler = require("../config/itemExecution.js");
const Item = require("../models/Item.js");
const CQuiz = require("../models/CQuiz.js");

router.post("/buyItem",async (req,res) =>
{
  try
  {
    let item = await Item.findById(req.body.id);

    for(let i = 0; i < itemHandler.length; i++)
    {
      if(itemHandler[i].ItemType === item.ItemType) return await itemHandler[i].Execution(req.user,item,res);
    }
  }
  catch
  {
    res.json({Sucess: false});
  }
})

router.post("/makeCQuiz",(req,res) =>
{
  let newCQuiz = new CQuiz(
    {
      UserID: req.user.id,
      QuestionAnswers: req.body.QuestionAnswers,
      Title: req.body.Title,
      AmountPlayed: 0,
      Username: req.user.Username,
    })

  newCQuiz.save()
  .then(() =>
  {
    req.user.CQuizzes.push(newCQuiz.id);

    req.user.save()
    .then(() =>
    {
      res.send({Sucess: true});
    })
  })
})


module.exports = router;
