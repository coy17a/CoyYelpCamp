var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=========================
// Comments Rute
//=========================
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, camp) {
    if (err) {
      console.log(err);
      console.log("opps");
    } else {
      res.render("comments/new", { camp: camp });
    }
  });
});
router.post("/", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, camp) {
    if (err) {
      console.log(err);
      console.log("opps");
      res.redirect("/campgrounds");
    } else {
      var text = req.body.text;
      var comment = { text };
      Comment.create(comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.username = req.user.username;
          comment.author.id = req.user._id;
          comment.save();
          camp.comments.push(comment._id);
          camp.save();
          req.flash("success", "Comment Created Succesfully")
          res.redirect("/campgrounds/" + camp._id);
        }
      });
    }
  });
});
//========================
// edit route
//=======================

router.get("/:comment_id/edit", middleware.checkCommentOwner, function(
  req,
  res
) {
  Comment.findById(req.params.comment_id, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/edit", { camp_id: req.params.id, comment: comment });
    }
  });
});
// update route
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    comment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment Updated Succesfully")
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Destroy
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(
    err,
    deletedComment
  ) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      req.flash("success", "Comment Deleted Succesfully")
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
