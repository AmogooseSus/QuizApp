const express = require("express");
const router = express.Router();
const QuizPlayer = require("../models/QuizPlayerModel.js");
const Quiz = require("../models/Quiz.js");
const CQuiz = require("../models/CQuiz.js");

router.get("/play", async(req,res) =>
{
  try
  {
    let potentialInstance = await QuizPlayer.findOne({QuizID: req.query.id, UserID: req.user.id});

    if(potentialInstance)
    {
      return res.render("main/QuizPlay",{Question: potentialInstance.QuestionAnswers[potentialInstance.CurrentQuestionIndex],PlayerID: potentialInstance.id})
    }
    else
    {
      let quiz = await Quiz.findById(req.query.id);

      if(!quiz || req.user.CompletedQuizzes.indexOf(quiz.id) !== -1) return res.redirect("/main/quizSearch");

      let player = new QuizPlayer(
        {
          QuestionAnswers: quiz.QuestionAnswers,
          QuizID: quiz.id,
          CurrentQuestionIndex: 0,
          CorrectAnswers: 0,
          UserID: req.user.id,
        })

      await player.save()

      res.render("main/QuizPlay",{Question: player.QuestionAnswers[player.CurrentQuestionIndex],PlayerID: player.id});
    }
  }
  catch
  {
    res.redirect("/main/quizSearch");
  }
})

router.get("/Cplay",async (req,res) =>
{
  try
  {
    let potentialInstance = await QuizPlayer.findOne({QuizID: req.query.id, UserID: req.user.id});

    if(potentialInstance)
    {
      return res.render("main/CQuizPlay",{Question: potentialInstance.QuestionAnswers[potentialInstance.CurrentQuestionIndex],PlayerID: potentialInstance.id})
    }
    else
    {
      let quiz = await CQuiz.findById(req.query.id);

      if(!quiz) return res.redirect("/main/quizSearch");

      let player = new QuizPlayer(
        {
          QuestionAnswers: quiz.QuestionAnswers,
          QuizID: quiz.id,
          CurrentQuestionIndex: 0,
          CorrectAnswers: 0,
          UserID: req.user.id,
        })

      await player.save()

      res.render("main/CQuizPlay",{Question: player.QuestionAnswers[player.CurrentQuestionIndex],PlayerID: player.id});
    }

  }
  catch
  {
    res.redirect("/main/Community");
  }

})

router.post("/CgetNextQuestion",async (req,res) =>
{
  try
  {
    let player = await QuizPlayer.findById(req.body.id);

    if(player.QuestionAnswers[player.CurrentQuestionIndex].correct_answer === req.body.answer)
    {
      player.CorrectAnswers++;
    }
    else
    {
      player.IncorrectAnswers.push({Question: player.QuestionAnswers[player.CurrentQuestionIndex].question,Answer: player.QuestionAnswers[player.CurrentQuestionIndex].correct_answer});
    }


    if(player.CurrentQuestionIndex + 1 > player.QuestionAnswers.length -1)
    {
      let cquiz = await CQuiz.findById(player.QuizID);

      cquiz.AmountPlayed++;

      await cquiz.save();

      await QuizPlayer.findByIdAndDelete(player.id);

      if(req.user.CompletedQuizzes.indexOf(cquiz.id) === -1 || req.user.CQuizzes.indexOf(cquiz.id) === -1)
      {
        await giveUserRewards(15,20,req.user,cquiz.id);

        return res.json({QuizComplete: true,WrongAnswers: player.IncorrectAnswers,Reward: true,CorrectAnswers:player.CorrectAnswers,QuizLength:player.QuestionAnswers.length });
      }

      return res.json({QuizComplete: true,WrongAnswers: player.IncorrectAnswers,Reward: false,CorrectAnswers: player.CorrectAnswers,QuizLength:player.QuestionAnswers.length});
    }

    player.CurrentQuestionIndex++;

    await player.save();

    res.json({QuestionOBJ: player.QuestionAnswers[player.CurrentQuestionIndex]});
  }
  catch
  {

  }
})


router.post("/getNextQuestion",async (req,res) =>
{
  try
  {
    let player = await QuizPlayer.findById(req.body.id);

    if(player.QuestionAnswers[player.CurrentQuestionIndex].correct_answer === req.body.answer)
    {
      player.CorrectAnswers++;
    }

    if(player.CurrentQuestionIndex + 1 > player.QuestionAnswers.length - 1 && player.CorrectAnswers >= 7)
    {
      let quiz = await Quiz.findById(player.QuizID);

      await giveUserRewards(quiz.Points,quiz.Coins,req.user,quiz.id);

      await QuizPlayer.findByIdAndDelete(player.id);

      return res.json({QuizComplete: true,Win: true,Coins: quiz.Coins,Points: quiz.Points});
    }
    else if(player.CurrentQuestionIndex + 1 > player.QuestionAnswers.length - 1)
    {
      await QuizPlayer.findByIdAndDelete(player.id);

      return res.json({QuizComplete: true,Win: false,CorrectAnswers: player.CorrectAnswers});
    }

    player.CurrentQuestionIndex++;

    await player.save()

    res.json({QuestionOBJ: player.QuestionAnswers[player.CurrentQuestionIndex]});

  }
  catch
  {

  }
})

async function giveUserRewards(points,coins,user,quizID)
{
  user.Points += points;
  user.Coins += coins;
  user.CompletedQuizzes.push(quizID);

  await user.save();

  return;
}


module.exports = router;
