const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")
//Reviews
//Post Route
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.createReview));


//Delete Route for Reviews
router.delete('/:reviewId', isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview)
);

module.exports = router;