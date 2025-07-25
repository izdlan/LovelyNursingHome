const Volunteer = require('../models/Volunteer');
const Booking = require('../models/Booking');
const Activity = require('../models/Activity');

exports.createVolunteer = async (volunteerData) => {
  const volunteer = new Volunteer(volunteerData);
  return await volunteer.save();
};

exports.findVolunteerByEmail = async (email) => {
  return await Volunteer.findOne({ email });
};

exports.deleteVolunteer = async (id) => {
  // Find all approved bookings by the volunteer
  const approvedBookings = await Booking.find({ volunteer: id, status: 'approved' });

  // Get the activity IDs from the approved bookings
  const activityIds = approvedBookings.map(b => b.activity);

  // Increment the slots for all the affected activities in a single query
  if (activityIds.length > 0) {
    await Activity.updateMany({ _id: { $in: activityIds } }, { $inc: { slots: 1 } });
  }

  // Delete all bookings by the volunteer
  await Booking.deleteMany({ volunteer: id });

  // Delete the volunteer
  return await Volunteer.findByIdAndDelete(id);
}; 