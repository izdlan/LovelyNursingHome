const Donation = require('../models/Donation');

exports.createDonation = async (donationData) => {
  const donation = new Donation(donationData);
  return await donation.save();
}; 