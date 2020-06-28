module.exports = function(QuestionAnswers,QuizID,userID)
{
  this.QuestionAnswers = QuestionAnswers;
  this.QuizID = QuizID,
  this.currentQuestionIndex = 0;
  this.correctAnswers = 0;
  this.userID: userID;
}
