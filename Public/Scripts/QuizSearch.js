let labels = document.querySelectorAll(".label");
let quizzesContainer = document.querySelector(".quizzes");


labels.forEach((label) =>
{
  label.addEventListener("click",() =>
  {
    label.classList.remove("bg-blue-300");
    label.classList.add("bg-blue-700");
    label.classList.add("shadow-inner");

    removeSelectedEffect(label.id);

    retreiveQuizzes(label.id);
  })
})

function removeSelectedEffect(excludeID)
{
  labels.forEach((label) =>
  {
    if(label.id !== excludeID)
    {
      label.classList.add("bg-blue-300");
      label.classList.remove("bg-blue-700");
      label.classList.remove("shadow-inner");
    }
  })
}

function retreiveQuizzes(categoryID)
{
  fetch("/main/getQuizzes",
  {
    headers:
    {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({categoryID})
  })
  .then(res => res.json())
  .then(data =>
    {
      makeQuizUI(data)
    })
}

function makeQuizUI(data)
{
  if(data.hasOwnProperty("error")) return;

  quizzesContainer.innerHTML = " ";

  data.quizzes.forEach((quiz) =>
  {
    let outerContainer = document.createElement("div");
    let quizCategoryText = document.createElement("h4");
    let quizDifficulty = document.createElement("h2");
    let completedText = document.createElement("h1");

    completedText.innerText = "Completed";
    completedText.classList.add("absolute", "text-5xl", "text-white");
    completedText.style.transform = "rotate(-50deg)";

    let rewardsContainer = document.createElement("div");

    let pointsContainer = document.createElement("div");
    let pointsTextIcon = document.createElement("h3");
    let pointsText = document.createElement("h4");

    let coinsContainer = document.createElement("div");
    let coinsIcon = document.createElement("i");
    let coinsText = document.createElement("h4");

    outerContainer.classList.add("w-56", "bg-blue-800", "h-64", "flex", "flex-col", "justify-around", "items-center","rounded-lg","shadow-lg", "p-2","cursor-pointer","relative");

    if(data.completedQuizzes.indexOf(quiz._id) === -1)
    {
      outerContainer.classList.add("hover:bg-blue-900");
      outerContainer.addEventListener("click",() =>
      {
        window.location = `/quizPlayer/play?id=${quiz._id}`;
      })
    }
    else
    {
      outerContainer.appendChild(completedText);

    }

    outerContainer.class
    quizCategoryText.innerText = quiz.CategoryName;
    quizCategoryText.classList.add("text-xl", "text-purple-100", "text-center");

    quizDifficulty.innerText = quiz.Difficulty.toUpperCase();
    quizDifficulty.classList.add("text-3xl", "text-blue-200");

    rewardsContainer.classList.add("flex", "w-full", "justify-around");

    pointsContainer.classList.add("flex", "items-center")
    coinsContainer.classList.add("flex", "items-center");

    pointsTextIcon.innerText = "P";
    pointsTextIcon.classList.add("text-xl","text-green-400");
    pointsText.innerText = quiz.Points;
    pointsText.classList.add("text-xl","text-green-500")

    coinsIcon.classList.add("fas", "fa-coins","fa-lg","text-orange-300");
    coinsText.innerText = quiz.Coins;
    coinsText.classList.add("text-xl", "text-yellow-500", "mr-8");


    coinsContainer.appendChild(coinsIcon);
    coinsContainer.appendChild(coinsText);

    pointsContainer.appendChild(pointsText);
    pointsContainer.appendChild(pointsTextIcon);

    rewardsContainer.appendChild(pointsContainer);
    rewardsContainer.appendChild(coinsContainer);

    outerContainer.appendChild(quizCategoryText);
    outerContainer.appendChild(quizDifficulty);
    outerContainer.appendChild(rewardsContainer);

    quizzesContainer.appendChild(outerContainer);
  })
}
