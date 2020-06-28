const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User.js");
const nodemailer = require("nodemailer");
const superSecretOBJ = require("../config/config.js");

router.get("/register", (req,res) =>
{
  if(req.isAuthenticated()) return res.redirect("/main/home");

  res.render("autho/register");
})

router.get("/login",(req,res) =>
{
  if(req.isAuthenticated()) return res.redirect("/main/home");

  res.render("autho/login",{error: req.flash()});
})

router.get("/verifyUser",(req,res) =>
{
  if(!req.query.id) return res.redirect("/autho/register");

  User.findById(req.query.id)
  .then(user =>
    {
      if(!user) return res.redirect("/autho/register");

      user.Verified = true;

      user.save()
      .then(() => {res.redirect("/autho/login")});
    })
})

router.post("/Register", (req,res) =>
{

   let {username,email,password} = req.body;

   //check if email already exists
   User.findOne({Email: email})
   .then(data =>
     {
       if(data) return res.render("autho/register", { message:"Email is already taken", type: "warning"});

       User.findOne({Username: username})
       .then(results =>
        {
           if(results)  return res.render("autho/register", { message:"Username is already taken",type: "warning"});

           let newUser = new User(
             {
               Username: username,
               Email : email,
               Password : password,
               Verified: false,
               Coins:  0,
               Points: 0,
               CQuizSlots: 3,
               CategoriesUnlocked:
               [
                 {CategoryName:"General Knowledge", CategoryID: 9},
                 {CategoryName: "Books", CategoryID: 10},
                 {CategoryName:"Films", CategoryID: 11},
                 {CategoryName:"Music",CategoryID: 12},
                 {CategoryName:"Televison",CategoryID: 14}
               ]
             })

           //hash password
           bcrypt.hash(newUser.Password,10,(err,hash) =>
           {
             if(err) throw err;

             newUser.Password = hash;

             //save user
             newUser.save((err,user) =>
             {
               if(err) throw err;

               sendEmail(newUser.Email,newUser.id,newUser.Username)
               .then(() =>
               {
                    res.render("autho/register",{message : "Please check your email and verify your account to log in", type: "sucess"});
               })
             });
           });

        })
      })

})


router.post("/login",(req,res,next) =>
{
   passport.authenticate("local",
   {
     successRedirect: "/main/home",
     failureRedirect: "/autho/login",
     failureFlash: true,
   })(req,res,next);
})

router.get("/logout", (req,res) =>
{
  req.logout();
  res.redirect("/autho/verify");

})


async function sendEmail(email,userID,userName)
{
 // create reusable transporter object using gmail
 let transporter = nodemailer.createTransport({
  service: "gmail",
  auth:
  {
    user: "harparkash73@gmail.com",
    pass: superSecretOBJ.googlePassword,
  }
 });

 // send mail with defined transport object
 let info = await transporter.sendMail({
   from: '"Quiz app" <HelloHello931@gmail.com>', // sender address
   to: email, // list of receivers
   subject: "Hello,verify your account here for the quiz", // Subject line
   text: "Hello world?", // plain text body
   html: `<b><a href="https://youtube.com">CLICK HERE TO GET YOUR MILLION POUNDS REWARD FROM BILL GATES</a></b>`, // html body
 });

 return;
}

module.exports = router;
