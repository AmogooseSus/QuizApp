const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const configPassport = require("./config/passport.js")(passport);
const checkAutho = require("./config/autho.js");
const mongoStore = require("connect-mongo")(session);
const fetch = require("node-fetch");
const superSecretOBJ = require("./config/config.js");


const uri = superSecretOBJ.mongoURI;

//initlise express
let app = express();

let port = process.env.PORT || 8080;

mongoose.set("useFindAndModify",false);

mongoose.connect(uri, {useNewUrlParser : true, useUnifiedTopology: true, useFindAndModify: false});

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

//set view engine to express
app.set("view engine","ejs");

//body parser decodes html form submitted data
app.use(express.urlencoded())
app.use(express.json());
//for static files like css and js that link to ejs
app.use(express.static("Public"));

//set up routes
app.get("/",(req,res) => res.redirect(`/autho/verify`));
app.use("/main",checkAutho.ensureAutho,require("./routes/main.js"));
app.use("/autho", require("./routes/autho.js"));
app.use("/update",checkAutho.ensureAutho,require("./routes/update.js"));


app.listen(port);
