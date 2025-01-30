const express = require('express');
const router = express.Router();
const { addApartment, getApartments, searchApartments, claimApartment, approveClaim, rejectClaim } = require('../controllers/apartmentController');
const auth = require('../middleware/auth');
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

//Claim an apartment
router.post('/:apartmentId/claim', auth, upload.array('claimDocuments', 5), claimApartment);

// Admin routes to approve/reject claims
router.patch('/:apartmentId/claim/approve', auth, approveClaim);
router.patch('/:apartmentId/claim/reject', auth, rejectClaim);

module.exports = router;