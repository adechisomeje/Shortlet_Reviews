const express = require('express');
const router = express.Router();
const { addApartment, getApartments } = require('../controllers/apartmentController');

// Add apartment
router.post('/', addApartment);

// Get all apartments
router.get('/', getApartments);

module.exports = router;