const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/', donationController.donate);
router.get('/', donationController.getAllDonations);

module.exports = router; 