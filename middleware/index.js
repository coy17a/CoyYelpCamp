var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};
middlewareObj.checkCampgroundOwner = function(req, res, next) {
  if (req.isAuthenticated()) {
    //does user own the campground
    Campground.findById(req.params.id, function(err, foundCamp) {
      if (err) {
        req.flash("error", "Campground not Found");
        res.redirect("back");
      } else {
        // foundCamp.author.id is an object
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have authorization");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be Logged In");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwner = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
        req.flash("error", "Comment not Found");
        res.redirect("back");
      } else {
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be Logged In");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be Logged In");
  res.redirect("/login");
};

module.exports = middlewareObj;
