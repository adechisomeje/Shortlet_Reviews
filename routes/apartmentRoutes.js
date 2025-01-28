const express = require('express');
const router = express.Router();
const { addApartment, getApartments, searchApartments } = require('../controllers/apartmentController');
const upload = require('../utils/upload');

// Add apartment with file uploads
router.post('/', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'proofOfOwnership', maxCount: 1 },
]), addApartment);

// Get all apartments
router.get('/', getApartments);

// Search apartments
router.get('/search', searchApartments);

module.exports = router;