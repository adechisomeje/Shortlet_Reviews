const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Studio', '1-Bedroom', '2-Bedroom', '3-Bedroom', 'Penthouse', 'Villa', 'Condo'], // Dropdown options
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    default: 0,
  },
  images: {
    type: [String], // Array of image URLs
    required: false,
    default: [],
  },
  proofOfOwnership: {
    type: String, // URL to the proof of ownership file (image or PDF)
    required: false,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who added the apartment
    required: false,
  },
}, {
  timestamps: true, // Adds `createdAt` and `updatedAt` fields
});

const Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;