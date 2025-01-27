const Apartment = require('../models/Apartment');

// Add a new apartment
const addApartment = async (req, res) => {
  const { name, location, description, addedBy } = req.body;
  try {
    const apartment = new Apartment({ name, location, description, addedBy });
    await apartment.save();
    res.status(201).json(apartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all apartments
const getApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.json(apartments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  addApartment,
  getApartments,
};