const express = require('express');
const { addReview, getReview } = require('../controllers/reviewController');
const router = express.Router();
const Review = require('../models/Review');

// Add Review
router.post('/', addReview)

// Get Reviews for an Apartment
router.get('/:apartmentId', getReview);

module.exports = router;