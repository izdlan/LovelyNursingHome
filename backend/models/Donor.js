const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  title: String,
  surname: String,
  given_name: String,
  nric: String,
  contact: String,
  email: String
});

module.exports = mongoose.model('Donor', donorSchema); 