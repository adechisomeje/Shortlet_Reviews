const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Apartment = require('../models/Apartment')

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    // Ensure indexes are built
    await Apartment.createIndexes();
    console.log('Indexes created successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;