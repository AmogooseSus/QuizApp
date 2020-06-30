const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const configPassport = require("./config/passport.js")(passport);
const checkAutho = require("./config/autho.js");
const mongoStore = require("connect-mongo")(session);
const fetch = require("node-fetch");
const superSecretOBJ = require("./config/config.js");
const flash = require("connect-flash");
const Quiz = require("./models/Quiz.js");


const uri = superSecretOBJ.mongoURI;

//initlise express
let app = express();

let port = process.env.PORT || 8080;

mongoose.set("useFindAndModify",false);

mongoose.connect(uri, {useNewUrlParser : true, useUnifiedTopology: true, useFindAndModify: false,useCreateIndex:  true});

let db = mongoose.connection;

//notify us when we connect so we know that we are connected
db.once("open" , () =>
{
  console.log("connected to mongodb");

})

//configures session
app.use(session({
  secret: superSecretOBJ.sessionSecret,
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection : db }),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//set view engine to express
app.set("view engine","ejs");

//body parser decodes html form submitted data
app.use(express.urlencoded())
app.use(express.json());
//for static files like css and js that link to ejs
app.use(express.static("Public"));

//set up routes
app.get("/",checkAutho.ensureAutho,(req,res) => res.redirect(`/main/home`));
app.use("/main",checkAutho.ensureAutho,require("./routes/main.js"));
app.use("/autho", require("./routes/autho.js"));
app.use("/update",checkAutho.ensureAutho,require("./routes/update.js"));
app.use("/quizPlayer",checkAutho.ensureAutho,require("./routes/player.js"));
app.get("/makeQuiz",(req,res) =>
{
  // makeQuiz(32,"hard","Cartoons",50,100,11);
})

async function makeQuiz(categoryID,difficulty,CategoryName,coinReward,pointsReward,amount)
{
  let token = "e8f9cd3c262755c204785b2e0083ff97353245f1bceabdd5da8cf43d4eeddb82";

  fetch(`https://opentdb.com/api.php?amount=${amount}&token=${token}&category=${categoryID}&difficulty=${difficulty}&type=multiple`)
  .then(res => res.json())
  .then(async (data) =>
    {
      if(data.response_code === 4 || data.response_code === 1 || data.response_code === 2) return console.log(data);
      let startingIndex = 0;
      let endingIndex = 10;
      let offsetIncrementer = 10;

      while(endingIndex <= amount)
      {
        let qas = data.results.slice(startingIndex,endingIndex);

        let quiz = new Quiz(
          {
            CategoryID: categoryID,
            CategoryName: CategoryName,
            QuestionAnswers: qas,
            Difficulty: difficulty,
            Points: pointsReward,
            Coins: coinReward,
          })

        await quiz.save()

        startingIndex += offsetIncrementer;
        endingIndex += offsetIncrementer;

        if(endingIndex === amount) console.log("done!");
      }
    })
  .catch(error => console.log(error))

}



app.listen(port);
