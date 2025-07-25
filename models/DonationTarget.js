const mongoose = require('mongoose');

const donationTargetSchema = new mongoose.Schema({
  target: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: String,
    required: true,
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
donationTargetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('DonationTarget', donationTargetSchema); 