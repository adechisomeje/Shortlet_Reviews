const Review = require('../models/review');
const Apartment = require('../models/apartment');

const writeReview = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check if the apartment exists
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) return res.status(404).json({ message: "Apartment not found." });

    // Create a new review
    const review = new Review({
      apartment: apartmentId,
      user: userId,
      rating,
      comment
    });

    await review.save();
    res.status(201).json({ success: true, message: "Review submitted!", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Thumbs Up or Down
const rateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { action } = req.body; // "like" or "dislike"

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (action === 'like') review.likes += 1;
    if (action === 'dislike') review.dislikes += 1;

    await review.save();
    res.json({ success: true, message: `Review ${action}d successfully!`, review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//Reply a Review
const replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    // Check if the review exists
    const parentReview = await Review.findById(reviewId);
    if (!parentReview) return res.status(404).json({ message: "Review not found." });

    // Create a new reply review
    const reply = new Review({
      apartment: parentReview.apartment,
      user: userId,
      comment,
    });

    await reply.save();

    // Attach the reply to the parent review
    parentReview.replies.push(reply._id);
    await parentReview.save();

    res.status(201).json({ success: true, message: "Reply submitted!", reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  writeReview,
  rateReview,
  replyToReview
};