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
      return res.render("main/QuizPlay",{Question: potentialInstance.QuestionAnswers[potentialInstance.CurrentQuestionIndex],PlayerID: potentialInstance.id})
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

      res.render("main/QuizPlay",{Question: player.QuestionAnswers[player.CurrentQuestionIndex],PlayerID: player.id});
    }

  }
  catch
  {
    res.redirect("/main/quizSearch");
  }

})

router.post("/CgetNextQuestion",async (req,res) =>
{
  let player = await QuizPlayer.findById(req.body.id);

  if(player.CurrentQuestionIndex + 1 > player.QuestionAnswers.length)
  {
    let cquiz = await CQuiz.findById(player.QuizID);

    cquiz.AmountPlayed++;

    await cquiz.save();

    await QuizPlayer.findByIdAndDelete(player.id);

    return res.json({QuizComplete: true,WrongAnswers: player.InncorrectAnswers});
  }

  if(player.QuestionAnswers[player.CurrentQuestionIndex].correct_answer === req.body.answer)
  {
    player.CorrectAnswers++;
  }
  else
  {
    player.InncorrectAnswers.push({Question: player.QuestionAnswers[player.CurrentQuestionIndex].question,Answer: player.QuestionAnswers[player.CurrentQuestionIndex].correct_answer});
  }

  player.CurrentQuestionIndex++;

  await player.save()

  res.json({QuestionOBJ: player.QuestionAnswers[player.CurrentQuestionIndex]});
})


router.post("/getNextQuestion",async (req,res) =>
{
    let player = await QuizPlayer.findById(req.body.id);

    if(player.CurrentQuestionIndex + 1 > player.QuestionAnswers.length - 1 && player.CorrectAnswers >= 7)
    {
      await giveUserRewards(player.QuizID,req.user);
      await QuizPlayer.findByIdAndDelete(player.id);

      return res.json({QuizComplete: true,Win: true});
    }
    else if(player.CurrentQuestionIndex + 1 > player.QuestionAnswers.length - 1)
    {
      await QuizPlayer.findByIdAndDelete(player.id);

      return res.json({QuizComplete: true,Win: false});
    }

    if(player.QuestionAnswers[player.CurrentQuestionIndex].correct_answer === req.body.answer)
    {
      player.CorrectAnswers++;
    }

    player.CurrentQuestionIndex++;

    await player.save()

    res.json({QuestionOBJ: player.QuestionAnswers[player.CurrentQuestionIndex]});
})

async function giveUserRewards(quizID,user)
{
  let quiz = await Quiz.findById(quizID);

  user.Points += quiz.Points;
  user.Coins += quiz.Coins;
  user.CompletedQuizzes.push(quiz.id);

  await user.save();

  return;
}


module.exports = router;
