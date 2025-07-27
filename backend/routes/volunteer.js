const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const activityController = require('../controllers/activityController');
const Booking = require('../models/Booking');
const Volunteer = require('../models/Volunteer');

router.get('/api/activities', activityController.getVolunteerActivities);

// Debug endpoint to check all activities in database
router.get('/debug-activities', async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    const allActivities = await Activity.find({});
    console.log('All activities in database:', allActivities);
    res.json({
      totalActivities: allActivities.length,
      activities: allActivities
    });
  } catch (error) {
    console.error('Debug activities error:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to get current volunteer info
// Debug endpoint to check session
router.get('/api/session-debug', (req, res) => {
  console.log('Session debug - Full session:', JSON.stringify(req.session));
  console.log('Session debug - Volunteer:', req.session.volunteer);
  console.log('Session debug - Session ID:', req.sessionID);
  
  res.json({
    sessionExists: !!req.session,
    sessionID: req.sessionID,
    volunteerInSession: !!req.session.volunteer,
    volunteerData: req.session.volunteer || null
  });
});

router.get('/api/me', async (req, res) => {
  try {
    console.log('Session data:', JSON.stringify(req.session));
    console.log('Volunteer in session:', req.session.volunteer);
    
    // Check if volunteer is in session
    if (req.session.volunteer && req.session.volunteer._id) {
      // Find the volunteer in the database to get fresh data
      const volunteer = await Volunteer.findById(req.session.volunteer._id);
      if (volunteer) {
        // Return only necessary info, not password
        return res.json({
          _id: volunteer._id,
          fullName: volunteer.fullName,
          email: volunteer.email,
          status: volunteer.status
        });
      }
    }
    res.status(401).json({ error: 'Not logged in or session expired' });
  } catch (error) {
    console.error('Error fetching volunteer info:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/signup', volunteerController.signup);
router.post('/book-activity', activityController.bookActivity);
router.get('/my-bookings', activityController.getMyBookings);
router.get('/calendar', activityController.getVolunteerCalendar);

// Debug route to check all bookings
router.get('/debug-bookings', async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate('activity', 'title date time')
      .populate('volunteer', 'fullName email');
    
    console.log('All bookings in database:', allBookings);
    res.json({
      totalBookings: allBookings.length,
      bookings: allBookings
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple test route to check if any bookings exist
router.get('/test-bookings', async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    const sampleBooking = await Booking.findOne().populate('activity volunteer');
    
    res.json({
      totalBookings: count,
      sampleBooking: sampleBooking,
      message: count > 0 ? 'Bookings exist in database' : 'No bookings found'
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test route to create a sample booking
router.post('/create-test-booking', async (req, res) => {
  try {
    const volunteerId = req.session.volunteer && req.session.volunteer._id;
    if (!volunteerId) {
      return res.status(401).json({ error: 'Not logged in' });
    }
    
    // Find an activity to book
    const Activity = require('../models/Activity');
    const activity = await Activity.findOne();
    
    if (!activity) {
      return res.status(404).json({ error: 'No activities found. Please create an activity first.' });
    }
    
    // Create a test booking
    const testBooking = new Booking({
      activity: activity._id,
      volunteer: volunteerId,
      status: 'approved'
    });
    
    await testBooking.save();
    
    res.json({
      success: true,
      message: 'Test booking created successfully',
      booking: testBooking
    });
  } catch (error) {
    console.error('Create test booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 