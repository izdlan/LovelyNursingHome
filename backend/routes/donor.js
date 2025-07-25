const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

// Add a new donor
router.post('/add', donorController.addDonor);

// Get all donors
router.get('/all', donorController.getAllDonors);

// Get donor by ID
router.get('/:id', donorController.getDonorById);

// Update donor
router.put('/:id', donorController.updateDonor);

// Delete donor
router.delete('/:id', donorController.deleteDonor);

// Search donors
router.get('/search', donorController.searchDonors);

module.exports = router; 