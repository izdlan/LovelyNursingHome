const Activity = require('../models/Activity');
const Booking = require('../models/Booking');

exports.createActivity = async (activityData) => {
  const activity = new Activity(activityData);
  return await activity.save();
};

exports.getAllActivities = async (filter = {}) => {
  return await Activity.find(filter);
};

exports.getActivityById = async (id) => {
  return await Activity.findById(id);
};

exports.updateActivity = async (id, updateData) => {
  return await Activity.findByIdAndUpdate(id, updateData, { new: true });
};

exports.updateActivityStatus = async (id, status) => {
  return await Activity.findByIdAndUpdate(id, { status }, { new: true });
};

exports.bookActivity = async (activityId, volunteerId) => {
  // Check if volunteer has already booked this activity
  const existingBooking = await Booking.findOne({ 
    activity: activityId, 
    volunteer: volunteerId 
  });
  
  if (existingBooking) {
    throw new Error('You have already booked this activity');
  }
  
  // Decrement slot if available
  const activity = await Activity.findOneAndUpdate(
    { _id: activityId, slots: { $gt: 0 }, status: 'active' },
    { $inc: { slots: -1 } },
    { new: true }
  );
  if (!activity) throw new Error('No slots available or activity is archived');
  
  // Create booking with status 'pending'
  const booking = new Booking({ activity: activityId, volunteer: volunteerId, status: 'pending' });
  await booking.save();
  return booking;
};

exports.updateBookingStatus = async (bookingId, status) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  const prevStatus = booking.status;
  booking.status = status;
  await booking.save();
  // If status changed to rejected and was not already rejected, increment slot
  if (status === 'rejected' && prevStatus !== 'rejected') {
    await Activity.findByIdAndUpdate(booking.activity, { $inc: { slots: 1 } });
  }
  return await Booking.findById(bookingId).populate('volunteer');
};

exports.deleteBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  
  // If the booking was approved, restore the slot
  if (booking.status === 'approved') {
    await Activity.findByIdAndUpdate(booking.activity, { $inc: { slots: 1 } });
  }
  
  // Delete the booking
  await Booking.findByIdAndDelete(bookingId);
  return { success: true, message: 'Booking deleted successfully' };
};

exports.getBookingsForVolunteer = async (volunteerId) => {
  return await Booking.find({ volunteer: volunteerId }).populate('activity').sort({ bookedAt: -1 });
};

exports.getBookingsForActivity = async (activityId) => {
  try {
    const bookings = await Booking.find({ activity: activityId })
      .populate('volunteer', 'fullName email status')
      .sort({ bookedAt: -1 });
    
    // Add debugging
    console.log('Bookings for activity:', activityId, 'Count:', bookings.length);
    bookings.forEach((booking, index) => {
      console.log(`Booking ${index + 1}:`, {
        id: booking._id,
        volunteerId: booking.volunteer,
        volunteerData: booking.volunteer,
        status: booking.status,
        bookedAt: booking.bookedAt
      });
    });
    
    return bookings;
  } catch (error) {
    console.error('Error in getBookingsForActivity:', error);
    throw error;
  }
};