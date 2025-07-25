const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  bookedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Booking', bookingSchema); 