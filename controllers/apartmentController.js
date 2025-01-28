const Apartment = require('../models/Apartment');

// Add apartment
// Add apartment
const addApartment = async (req, res) => {
  try {
    const { name, type, country, city, address, phoneNumber, addedBy } = req.body;

    // Handle files safely with fallback
    const images = req.files && req.files['images']
      ? req.files['images'].map(file => file.path)
      : []; // Default to an empty array if no images are uploaded

    const proofOfOwnership =
      req.files && req.files['proofOfOwnership']
        ? req.files['proofOfOwnership'][0].path
        : null; // Default to null if proofOfOwnership is not uploaded

    const apartment = new Apartment({
      name,
      type,
      country,
      city,
      address,
      phoneNumber,
      images,
      proofOfOwnership,
      addedBy,
    });

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

// Search apartments by name or location
const searchApartments = async (req, res) => {
    const { query } = req.query; // Get the search query from the request
  
    try {
      // Search for apartments by name or location (city or country)
      const apartments = await Apartment.find({
        $or: [
          { name: { $regex: query, $options: 'i' } }, // Case-insensitive search by name
          { city: { $regex: query, $options: 'i' } }, // Case-insensitive search by city
          { country: { $regex: query, $options: 'i' } }, // Case-insensitive search by country
        ],
      });
  
      if (apartments.length > 0) {
        // If results are found, return them
        res.json(apartments);
      } else {
        // If no results are found, return a message
        res.status(404).json({ message: "Can't find your apartment", query });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

module.exports = {
  addApartment,
  getApartments,
  searchApartments
};