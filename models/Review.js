const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Star rating (1-5)
  comment: { type: String, required: true }, // Review text
  likes: { type: Number, default: 0 }, // Thumbs up count
  dislikes: { type: Number, default: 0 }, // Thumbs down count
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Nested replies
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
