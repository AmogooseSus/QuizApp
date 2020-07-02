let quizTitle = " ";
let quizTotalQuestions = 0;
let currentQuestionCount = 0;
let QAS = [  ];
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const question = document.getElementById("question");
const correct_answer = document.getElementById("correct");
const incorrect_answers =  Array.from(document.querySelectorAll(".wrong"));
const nextQuestionBtn = document.getElementById("next-question");

document.getElementById("initial-setup").addEventListener("click",() =>
{
  if(validateInputs([titleInput,amountInput]) && amountInput.value > 0)
  {
    quizTitle = titleInput.value;
    quizTotalQuestions = amountInput.value;
    document.querySelector(".initial-setup").classList.add("hidden");
    document.querySelector(".creator").classList.remove("hidden");
  }
  else
  {
    alert("invalid values");
  }
})


nextQuestionBtn.addEventListener("click",() =>
{
  if(validateInputs([question,correct_answer,...incorrect_answers]))
  {
    let incorrectValues = () =>
    {
      let arr = [ ];

      incorrect_answers.forEach((input) =>
      {
        arr.push(input.value);
      })

      return arr;
    };

    let newQuestion = new Question(question.value,correct_answer.value,incorrectValues());

    QAS.push(newQuestion);

    currentQuestionCount++;

    clearAllFileds([question,correct_answer,...incorrect_answers]);

    if(currentQuestionCount === parseInt(quizTotalQuestions))
    {
      makeCQuiz(QAS,quizTitle);
    }

    return;
  }

  alert("Please fill out all values");
})

function Question(question,correct_answer,incorrect_answers)
{
  this.question = question;
  this.correct_answer = correct_answer;
  this.incorrect_answers = incorrect_answers;
}

function validateInputs(arrOfInputs)
{
  for(let i = 0; i < arrOfInputs.length; i++)
  {
    if(arrOfInputs[i].value.length === 0) return false;
  }

  return true;
}

function clearAllFileds(arrOfInputs)
{
  for(let i = 0; i < arrOfInputs.length; i++)
  {
     arrOfInputs[i].value = " ";
  }

}

function makeCQuiz(QuestionAnswers,Title)
{
  if(Title === " ") return;

  fetch("/update/makeCQuiz",
  {
    headers:
    {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({QuestionAnswers,Title}),
  })
  .then(res => res.json())
  .then(data =>
    {
      window.location.href = "/main/Community";
    })
}
