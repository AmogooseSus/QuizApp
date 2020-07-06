const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz.js");
const Item = require("../models/Item.js");
const CQuiz = require("../models/CQuiz.js");
const User = require("../models/User.js");

router.get("/home",async (req,res) =>
{
  let topPlayers = await User.find().sort({Points: "descending"}).limit(10);

  res.render("main/Home",{topPlayers});
})

router.get("/quizSearch",(req,res) =>
{
  res.render("main/QuizSearch",{Categories: req.user.CategoriesUnlocked});
})

router.get("/store",async (req,res) =>
{
  let items = await Item.find();

  res.render("main/Shop",{Items: items,CategoriesUnlocked: req.user.CategoriesUnlocked,Coins: req.user.Coins});
})

router.get("/Community",async (req,res) =>
{
  let cQuizzes = await CQuiz.find().sort({AmountPlayed: "descending"});

  res.render("main/Community",{Quizzes: cQuizzes});
})

router.get("/Creator",(req,res) =>
{
  if(req.user.CQuizSlots === req.user.CQuizzes.length)
  {
    return res.render("main/Creator",{error: "You don't have enough slots to make a quiz,please buy a slot or delete and existing quiz"});
  }

  res.render("main/Creator");
})

router.get("/profile",async (req,res) =>
{
  let userQuizzes = await CQuiz.find({UserID: req.user.id}).sort({AmountPlayed: "descending"});
  let userFriends = await getUsers(req.user.Friends);
  let userFriendRequests = await getUsers(req.user.FriendRequests);

  res.render("main/Profile",{userInfo: req.user,userFriends,userFriendRequests,userQuizzes});
})

router.get("/otherProfile",async (req,res) =>
{
  try
  {
    let userInfo =  await User.findById(req.query.id);
    let userQuizzes = await CQuiz.find({UserID: req.query.id}).sort({AmountPlayed: "descending"});
    let userFriends = await getUsers(userInfo.Friends);

    res.render("main/OtherProfile",{userInfo,userQuizzes,userFriends,viewingUser: req.user});
  }
  catch
  {
    res.redirect("/main/home");
  }
})

router.post("/getQuizzes",(req,res) =>
{
  //determine if user has acess to the quiz category
  if(determineAcessToCategory(req.user,req.body.categoryID))
  {
    //find quizzes via the category and send them
    getQuizzesViaCategoryID(req.body.categoryID)
    .then(data =>
      {
        res.json({quizzes: data,completedQuizzes: req.user.CompletedQuizzes});
      })
  }
  else
  {
    res.json({error: "nothing could be found"});
  }
})

function determineAcessToCategory(user,id)
{
  for(let i = 0; i < user.CategoriesUnlocked.length; i++)
  {
    if(user.CategoriesUnlocked[i].CategoryID == id) return true;
  }

  return false;
}


async function getQuizzesViaCategoryID(id)
{
  try
  {
    let quizzes = await Quiz.find({CategoryID: id});

    return quizzes;
  }
  catch
  {
    return null;
  }
}

async function getUsers(collectionOfIDs)
{
  let users = [ ];

  let getData = collectionOfIDs.map(id =>
    {
      return User.findById(id)
      .then((data) =>
      {
        users.push(data);
      })
    })

  await Promise.all(getData)

  return users;
}

module.exports = router;
