var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var passport = require("passport");

//==================
// AUTH ROUTES
// ===============

// Sign Up 
//landing Route
router.get("/", function (req, res) {
 res.render("landing");
});


router.get("/register", function(req,res){
    res.render("register")
    });
    
router.post("/register", function(req, res) {
      var username = req.body.username;
      var password = req.body.password;
      User.register(new User({ username: username }), password, function(
        err,
        user
      ) {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
          req.flash("success", "Welcome to YelpCamp "+ user.username);
          res.redirect("/campgrounds");
        });
      });
    });
    
    // login
    
 router.get("/login", function(req,res){
      res.render("login");
    });
    
router.post('/login', passport.authenticate("local", {
      successRedirect: "/campgrounds",
      failureRedirect: "/login",
      failureFlash: true,
      succesFlash:true
    }), function (req,res){
    
    });
    
    //logout
    
router.get("/logout", function(req,res){
      req.logout();
      req.flash("error", "Logged Out");
      res.redirect("/");
    });
    
    module.exports = router;