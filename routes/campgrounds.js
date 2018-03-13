var express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  //automatic require index.js
  middleware = require("../middleware"),
  geocoder = require('geocoder');

 // index

router.get("/", function(req, res) {
  //gell all campground form db

  Campground.find({}, function(err, allCamp) {
    if (err) {
      console.log(err);
      console.log("opps");
    } else {
      console.log(req.user);
      res.render("campgrounds/index", { campgrounds: allCamp });
    }
  });
});
//Create Camp
router.post("/", middleware.isLoggedIn, function(req, res) {
  //get data from form and add to array
  var name = req.body.name;
  var img = req.body.img;
  var description = req.body.description;
  var price = req.body.Price;
  var author = {
    username: req.user.username,
    id: req.user._id
  };

  geocoder.geocode(req.body.location, function(err, data){
    if (err || data.status === 'ZERO_RESULTS') {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    } 
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    console.log(location);
    console.log(lat);

    var newcamp = { name: name, image: img, description: description, price: price, author, location: location, lat:lat, lng:lng};

  Campground.create(newcamp, function(err, newCamp) {
    if (err) {
      console.log(err);
    } else {
      // newCamp.author.username= req.user.username;
      // newCamp.author.id= req.user._id;
      // newCamp.save();
      req.flash("success", "Campground Created Succesfully")
      res.redirect("/campgrounds");
    }
  });
  });

});
//New Route show form
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});
//show  show info about camp /campgrounds/:id
router.get("/:id", function(req, res) {
  //find the camground with the provide id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCamp) {
      if (err) {
        console.log("oopss");
        console.log(err);
      } else {
        console.log("camp found");
        //render template with the i
        res.render("campgrounds/show", { camp: foundCamp });
      }
    });
});
//========================
// EDIT and Update
//========================
// edit
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCamp) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/edit", { camp: foundCamp });
    }
  });
});

// Update
// make sure to install method override app.use(methodOverride("_method"));
router.put("/:id", middleware.checkCampgroundOwner, function(req, res) {
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    console.log(newData.location);
    console.log(newData.lat);
    console.log(newData.lng);
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(
    err,
    camp
  ) {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Campground Updated Succesfully")
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
});
// Destroy

router.delete("/:id", middleware.checkCampgroundOwner, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err, campDeleted) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground Deleted Succesfully")
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
