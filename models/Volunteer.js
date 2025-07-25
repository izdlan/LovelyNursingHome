const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  icnumber: String,
  phone: String,
  password: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
