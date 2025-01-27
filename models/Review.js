const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
});

module.exports = mongoose.model('Review', reviewSchema);