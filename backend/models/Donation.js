const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  title: String,
  surname: String,
  given_name: String,
  nric: String,
  contact: String,
  email: String,
  donation_type: String,
  donation_amount: Number,
  payment_mode: String,
  consent: String,
  donation_date: Date
});

module.exports = mongoose.model('Donation', donationSchema);
