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
    enum: ['Studio', '1-Bedroom', '2-Bedroom', '3-Bedroom', 'Penthouse', 'Villa', 'Condo'],
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
    type: [String],
    required: false,
    default: [],
  },
  proofOfOwnership: {
    type: String,
    required: false,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  
  // New fields for claiming
  isClaimed: { type: Boolean, default: false }, // False until verified
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // User who claimed
  claimDocuments: { type: [String], default: [] }, // URLs of verification docs
  claimStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Status of claim
},  {
  timestamps: true,
});

// Add a text index on name, city, and country fields
apartmentSchema.index({ name: 'text', city: 'text', country: 'text' });


const Apartment = mongoose.models.Apartment || mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;
