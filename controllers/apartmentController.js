const Apartment = require('../models/Apartment');

// Add apartment
const addApartment = async (req, res) => {
  try {
    const { name, type, country, city, address, phoneNumber, addedBy } = req.body;

    // Check if the apartment already exists
    const existingApartment = await Apartment.findOne({ name, address });

    if (existingApartment) {
      return res.status(400).json({
        success: false,
        message: "This apartment already exists. You may want to review it instead.",
      });
    }

    const images = req.files?.images ? req.files.images.map(file => file.path) : [];
    const proofOfOwnership = req.files?.proofOfOwnership?.[0]?.path || null;

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
    res.status(201).json({
      success: true,
      message: "Apartment added successfully!",
      apartment,
    });
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
  const { query, type, country, city, page = 1, limit = 10 } = req.query;

  try {
    const searchFilter = {};

    if (query) {
      searchFilter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { country: { $regex: query, $options: 'i' } },
      ];
    }

    if (type) searchFilter.type = type;
    if (country) searchFilter.country = country;
    if (city) searchFilter.city = city;

    const skip = (page - 1) * limit;

    const apartments = await Apartment.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    if (apartments.length === 0) {
      return res.json({
        success: true,
        message: "No apartments found. You can add a new one.",
        results: [],
      });
    }

    res.json({
      success: true,
      total: apartments.length,
      page: Number(page),
      limit: Number(limit),
      results: apartments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//ClaimApartment
const claimApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const userId = req.user.id; // Assuming authentication middleware extracts user ID

    // Ensure claim documents are provided
    const claimDocuments = req.files?.claimDocuments?.map(file => file.path) || [];

    if (claimDocuments.length === 0) {
      return res.status(400).json({ success: false, message: "Supporting documents are required for verification." });
    }

    // Find the apartment
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ success: false, message: "Apartment not found." });
    }

    // Check if already claimed
    if (apartment.isClaimed) {
      return res.status(400).json({ success: false, message: "This apartment has already been claimed." });
    }

    // Update apartment claim request
    apartment.claimedBy = userId;
    apartment.claimDocuments = claimDocuments;
    apartment.claimStatus = 'pending';

    await apartment.save();

    res.json({ success: true, message: "Claim request submitted for verification.", apartment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Admin Approve Claim
const approveClaim = async (req, res) => {
  try {
    const { apartmentId } = req.params;

    // Find the apartment
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) return res.status(404).json({ message: "Apartment not found." });

    if (apartment.claimStatus !== 'pending') {
      return res.status(400).json({ message: "Claim is not pending approval." });
    }

    apartment.isClaimed = true;
    apartment.claimStatus = 'approved';

    await apartment.save();

    res.json({ success: true, message: "Claim approved successfully.", apartment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Admin Reject Claim

const rejectClaim = async (req, res) => {
  try {
    const { apartmentId } = req.params;

    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) return res.status(404).json({ message: "Apartment not found." });

    if (apartment.claimStatus !== 'pending') {
      return res.status(400).json({ message: "Claim is not pending approval." });
    }

    apartment.isClaimed = false;
    apartment.claimedBy = null;
    apartment.claimDocuments = [];
    apartment.claimStatus = 'rejected';

    await apartment.save();

    res.json({ success: true, message: "Claim rejected successfully.", apartment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




module.exports = {
  addApartment,
  getApartments,
  searchApartments,
  claimApartment,
  approveClaim,
  rejectClaim
};