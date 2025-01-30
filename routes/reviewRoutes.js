const express = require('express');
const router = express.Router();
const { writeReview, rateReview, replyToReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Write a review & give star rating
router.post('/:apartmentId', auth, writeReview);

// Like or Dislike a review
router.post('/:reviewId/rate', auth, rateReview);

// Reply to a review
router.post('/:reviewId/reply', auth, replyToReview);

module.exports = router;
