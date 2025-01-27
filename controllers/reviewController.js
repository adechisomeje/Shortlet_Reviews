const Review = require('..models/Review');


//Add Review
const addReview = async (req, res) => {
    const { apartment, user, rating, comment } = req.body;
    try {
      const review = new Review({ apartment, user, rating, comment });
      await review.save();
      res.status(201).json(review);
    } catch (err) {
      res.status(400).send(err.message);
    }
  };


  //Get Review

  const getReview = async (req, res) => {
    try {
      const reviews = await Review.find({ apartment: req.params.apartmentId }).populate('user');
      res.json(reviews);
    } catch (err) {
      res.status(400).send(err.message);
    }
  };

  module.exports = {
      addReview,
      getReview
  }
