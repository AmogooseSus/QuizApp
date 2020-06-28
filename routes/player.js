const express = require("express");
const router = express.Router();
const QuizPlayer = require("../models/QuizPlayerModel.js");
const Quiz = require("../models/Quiz.js");

router.get("/play", async(req,res) =>
{
   let potentialInstance = await QuizPlayer.findOne({QuizID: req.query.id, UserID: req.user.id});

   if(potentialInstance)
   {
     return res.render("main/QuizPlay",{Question: potentialInstance.QuestionAnswers[potentialInstance.CurrentQuestionIndex],PlayerID: potentialInstance.id})
   }
   else
   {
     let quiz = await Quiz.findById(req.query.id);

     if(!quiz || req.user.CompletedQuizzes.indexOf(quiz.id) > -1) return res.redirect("/main/home");

     let player = new QuizPlayer(
       {
         QuestionAnswers: quiz.QuestionAnswers,
         QuizID: req.query.id,
         CurrentQuestionIndex: 0,
         CorrectAnswers: 0,
         UserID: req.user.id,
       })

     await player.save()

     res.render("main/QuizPlay",{Question: player.QuestionAnswers[player.CurrentQuestionIndex],PlayerID: player.id});
   }

})

router.get("/Cplay",(req,res) =>
{

})


router.post("/getNextQuestion",async (req,res) =>
{
    let player = await QuizPlayer.findById(req.body.id);

    if(player.CurrentQuestionIndex + 1 > player.QuestionAnswers.length)
    {
      await giveUserRewards(req.body.id,req.user);
      return res.json({QuizComplete: true});
    }

    if(player.QuestionAnswers[player.CurrentQuestionIndex].correct_answer === req.body.answer)
    {
      player.CorrectAnswers++;
    }

    player.CurrentQuestionIndex++;

    player.save()
    .then(() =>
    {
      res.json({QuestionOBJ: player.QuestionAnswers[player.CurrentQuestionIndex]});
    })


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
