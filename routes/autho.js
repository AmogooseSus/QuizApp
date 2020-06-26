const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User.js");



router.get("/verify", (req,res) =>
{
  if(req.isAuthenticated()) return res.redirect("/main/home");

  res.render("autho/verify");
})

router.post("/Register", async (req,res) =>
{

   let {username,email,password} = req.body;

   //check if email already exists
   User.findOne({Email: email})
   .then(data =>
     {
       if(data) return res.render("autho/verify", { message:"Email is already taken", type: "warning"});

       User.findOne({UserName: username})
       .then(results =>
        {
           if(results)  return res.render("autho/verify", { message:"Username is already taken",type: "warning"});

           let newUser = new User(
             {
               UserName: username,
               Email : email,
               Password : password,
             })

           //hash password
           bcrypt.hash(newUser.Password,10,(err,hash) =>
           {
             if(err) throw err;

             newUser.Password = hash;

             //save user
             newUser.save((err,user) =>
             {
               console.log(user);
               if(err) throw err;

               res.render("autho/verify",{message : "You can now log in", type: "sucess"});
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
     failureRedirect: "/autho/verify",
   })(req,res,next);
})

router.get("/logout", (req,res) =>
{
  req.logout();
  res.redirect("/autho/verify");

})

module.exports = router;
