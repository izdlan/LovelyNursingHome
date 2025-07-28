const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const activityController = require('../controllers/activityController');
const donationController = require('../controllers/donationController');
const volunteerController = require('../controllers/volunteerController');
const DonationTarget = require('../models/DonationTarget');
const Volunteer = require('../models/Volunteer');
const Admin = require('../models/Admin');
const Booking = require('../models/Booking');

// Admin authentication middleware
const requireAdminAuth = (req, res, next) => {
  console.log('Admin auth check - Session:', JSON.stringify(req.session));
  console.log('Admin auth check - Admin in session:', req.session.admin);
  
  if (!req.session.admin) {
    console.log('Admin not authenticated, redirecting to login');
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  console.log('Admin authenticated:', req.session.admin.username);
  next();
};

// ✅ Setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ POST route to add activity
router.post('/add-activity', activityController.addActivity);

// ✅ GET route to retrieve all activities
router.get('/api/activities', requireAdminAuth, activityController.getAdminActivities);

// ✅ GET route to retrieve all donations
router.get('/api/donations', requireAdminAuth, donationController.getAllDonations);

// ✅ GET route to retrieve bookings for an activity
router.get('/api/activities/:activityId/bookings', requireAdminAuth, activityController.getBookingsForActivity);

// ✅ POST route to update booking status
router.post('/api/bookings/:bookingId/status', requireAdminAuth, activityController.updateBookingStatus);

// ✅ DELETE route to delete a booking
router.delete('/api/bookings/:bookingId', requireAdminAuth, activityController.deleteBooking);

// GET route for a single activity
router.get('/api/activities/:id', requireAdminAuth, activityController.getActivityById);

// PUT route to update an activity
router.put('/api/activities/:id', requireAdminAuth, activityController.updateActivity);

// Route to update activity status (archive/restore)
router.put('/api/activities/:id/status', requireAdminAuth, activityController.updateActivityStatus);

// DELETE route to remove a volunteer
router.delete('/volunteers/:id', requireAdminAuth, volunteerController.removeVolunteer);

// ✅ GET route to retrieve donation target
router.get('/api/donation-target', requireAdminAuth, async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    let target = await DonationTarget.findOne({ month: currentMonth });
    
    if (!target) {
      // If no target for current month, get the most recent target
      target = await DonationTarget.findOne().sort({ createdAt: -1 });
    }
    
    res.json({ target: target ? target.target : null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donation target' });
  }
});

// ✅ POST route to set donation target
router.post('/api/donation-target', requireAdminAuth, async (req, res) => {
  try {
    const { target } = req.body;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    if (!target || target <= 0) {
      return res.status(400).json({ error: 'Invalid target amount' });
    }
    
    // Update or create target for current month
    await DonationTarget.findOneAndUpdate(
      { month: currentMonth },
      { target },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, target });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set donation target' });
  }
});

// ✅ GET route to retrieve all approved volunteers
router.get('/volunteers/approved', requireAdminAuth, async (req, res) => {
  try {
    const approved = await Volunteer.find({ status: 'approved' });
    res.json(approved);
  } catch (err) {
    res.status(500).send('❌ Failed to fetch approved volunteers');
  }
});

// ✅ GET route to retrieve all feedbacks
router.get('/api/feedbacks', requireAdminAuth, async (req, res) => {
  try {
    const Feedback = require('../models/Feedback');
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).send('❌ Failed to fetch feedbacks');
  }
});

// ✅ GET route to view volunteer calendar (admin view)
router.get('/volunteer-calendar', requireAdminAuth, async (req, res) => {
  try {
    const { month, year, volunteerId } = req.query;
    
    let query = {};
    
    // Filter by specific volunteer if provided
    if (volunteerId) {
      query.volunteer = volunteerId;
    }
    
    // Filter by month/year if provided
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      
      // Use aggregation to filter by activity date
      const aggregationPipeline = [
        { $match: query }
      ];
      
      if (volunteerId) {
        aggregationPipeline[0].$match.volunteer = volunteerId;
      }
      
      aggregationPipeline.push(
        {
          $lookup: {
            from: 'activities',
            localField: 'activity',
            foreignField: '_id',
            as: 'activity'
          }
        },
        { $unwind: '$activity' },
        {
          $lookup: {
            from: 'volunteers',
            localField: 'volunteer',
            foreignField: '_id',
            as: 'volunteer'
          }
        },
        { $unwind: '$volunteer' },
        {
          $match: {
            'activity.date': { $gte: startDate, $lte: endDate }
          }
        },
        { $sort: { 'activity.date': 1, 'activity.time': 1 } }
      );
      
      const bookings = await Booking.aggregate(aggregationPipeline);
      console.log('Admin calendar query result:', bookings.length, 'bookings found');
      res.json(bookings);
    } else {
      // If no month/year filter, get all bookings
      const bookings = await Booking.find(query)
        .populate('volunteer', 'fullName email phone')
        .populate('activity', 'title date time description')
        .sort({ 'activity.date': 1, 'activity.time': 1 });
      
      console.log('Admin calendar query result (no filter):', bookings.length, 'bookings found');
      res.json(bookings);
    }
  } catch (error) {
    console.error('Calendar error:', error);
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
});

// ✅ POST route to register new user (admin only)
router.post('/register-user', async (req, res) => {
  try {
    const { fullName, email, icnumber, phone, password, role } = req.body;
    
    // Validate required fields based on role
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }
    
    if (role === 'volunteer' && (!fullName || !icnumber || !phone)) {
      return res.status(400).json({ error: 'Full name, IC number, and phone are required for volunteers' });
    }
    
    // Check if email already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    const existingAdmin = await Admin.findOne({ username: email });
    
    if (existingVolunteer || existingAdmin) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (role === 'volunteer') {
      // Create new volunteer (automatically approved since admin is creating)
      const volunteer = new Volunteer({
        fullName,
        email,
        icnumber,
        phone,
        password: hashedPassword,
        status: 'approved' // Auto-approve since admin is creating
      });
      await volunteer.save();
      
      // Send welcome email to new volunteer
      try {
        const { sendEmail } = require('../services/emailNotifier');
        const subject = 'Welcome to Lovely Nursing Home - Volunteer Account Created';
        const emailBody = `Dear ${fullName},

Welcome to Lovely Nursing Home!

Your volunteer account has been created and approved. Here are your login details:

Email: ${email}
Password: ${password}

You can now log in at: ${req.protocol}://${req.get('host')}/volunteer_login.html

Thank you for your willingness to serve our community!

Best regards,
Lovely Nursing Home Team`;
        
        await sendEmail(email, subject, emailBody);
        console.log('Welcome email sent to:', email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the registration if email fails
      }
      
      res.json({ success: true, message: 'Volunteer registered successfully and welcome email sent!' });
    } else if (role === 'admin') {
      // Create new admin
      const admin = new Admin({
        username: email,
        password: hashedPassword
      });
      await admin.save();
      
      // Send admin account details email
      try {
        const { sendEmail } = require('../services/emailNotifier');
        const subject = 'Lovely Nursing Home - Admin Account Created';
        const emailBody = `Dear ${fullName || 'Admin'},

Your admin account has been created for Lovely Nursing Home.

Login details:
Username: ${email}
Password: ${password}

Admin Dashboard: ${req.protocol}://${req.get('host')}/admin_login.html

Please keep these credentials secure.

Best regards,
Lovely Nursing Home Team`;
        
        await sendEmail(email, subject, emailBody);
        console.log('Admin credentials email sent to:', email);
      } catch (emailError) {
        console.error('Failed to send admin email:', emailError);
        // Don't fail the registration if email fails
      }
      
      res.json({ success: true, message: 'Admin registered successfully and credentials email sent!' });
    } else {
      res.status(400).json({ error: 'Invalid role specified' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user: ' + error.message });
  }
});

// ✅ Export the router
module.exports = router;