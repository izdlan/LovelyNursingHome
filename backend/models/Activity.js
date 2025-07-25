const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  slots: Number,
  image: String,
  status: { type: String, enum: ['active', 'archived'], default: 'active' }
});

module.exports = mongoose.model('Activity', activitySchema);
