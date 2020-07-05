const express = require("express");
const router = express.Router();
const itemHandler = require("../config/itemExecution.js");
const User = require("../models/User.js");
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

router.post("/makeFriendRequest",(req,res) =>
{
  User.findOne({Username: req.body.username})
  .then(user =>
    {
      if(!user || user.id === req.user.id) return res.json({content: "User could not be found"});
      if(req.user.Friends.indexOf(user.id) !== -1) return res.json({content: "User is already your friend"});
      if(req.user.FriendRequests.indexOf(user.id) !== -1) return res.json({content: `${user.Username} has already sent you a friend request`});
      if(user.FriendRequests.indexOf(req.user.id) !== -1) return res.json({content: `You've already sent this user a request`});

      user.FriendRequests.push(req.user.id);

      user.save()
      .then(() =>
      {
        res.json({content: "Sucessfully sent!"});
      })
    })
})

router.post("/acceptFriendRequest",(req,res) =>
{
  User.findById(req.body.userID)
  .then(async (user) =>
    {
      if(!user) return res.json({});

      req.user.Friends.push(user.id);
      user.Friends.push(req.user.id);

      req.user.FriendRequests.splice(req.user.FriendRequests.indexOf(user.id),1);

      await req.user.save();
      await user.save();

      res.send("ok");
    })
})

module.exports = router;
