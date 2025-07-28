const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin'); 
const Donation = require('./models/Donation');
const Volunteer = require('./models/Volunteer');
const Activity = require('./models/Activity');
const multer = require('multer');
const path = require('path');
const adminRoutes = require('./routes/admin'); 
const volunteerRoutes = require('./routes/volunteer');
const donateRoutes = require('./routes/donate');
const feedbackRoute = require('./routes/feedback');
const donorRoutes = require('./routes/donor');
require('./services/emailNotifier');

// Create Express app but don't start it (it will be started by index.js)
const app = express();

// MongoDB connection is now handled in index.js

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Update static file serving to be more explicit
app.use(express.static(path.join(__dirname, '../frontend/public')));
// Add debugging for static file serving
console.log('Static files directory:', path.join(__dirname, '../frontend/public'));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Add raw body capture middleware for debugging (only for specific routes)
app.use((req, res, next) => {
  // Only capture raw body for feedback route where we need it
  if (req.path === '/feedback' && req.method === 'POST') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      req.rawBody = data;
      console.log('Raw body captured:', data);
      next();
    });
  } else {
    // For all other routes, just pass through
    next();
  }
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://whaiqal7:Wanzack123@lovelynursinghome.sbhoe2w.mongodb.net/lovely_nursing_home?retryWrites=true&w=majority&appName=LovelyNursingHome',
    ttl: 14 * 24 * 60 * 60 // 14 days session expiration
  }),
  cookie: {
    secure: false, // Set to false to allow HTTP cookies for development and mixed environments
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
  }
}));

// Add explicit route for the root path
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/public/index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

// ✅ Volunteer Login
app.post('/volunteer/login', async (req, res) => {
  console.log('=== VOLUNTEER LOGIN START ===');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  try {
    const { email, password } = req.body;
    console.log('Extracted email:', email);
    
    const volunteer = await Volunteer.findOne({ email });
    console.log('Volunteer found:', volunteer ? 'Yes' : 'No');

    if (!volunteer) {
      console.log('Volunteer not found, redirecting...');
      return res.redirect('/confirmation.html?title=Volunteer+Not+Found&text=No+volunteer+account+found+with+that+email.&btn=Try+Again&href=%2Fvolunteer_login.html');
    }

    const isMatch = await bcrypt.compare(password, volunteer.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password incorrect, redirecting...');
      return res.redirect('/confirmation.html?title=Incorrect+Password&text=The+password+you+entered+is+incorrect.&btn=Try+Again&href=%2Fvolunteer_login.html');
    }

    if (volunteer.status !== 'approved') {
      console.log('Volunteer not approved, redirecting...');
      return res.redirect('/confirmation.html?title=Pending+Approval&text=Your+account+is+awaiting+admin+approval.&btn=Back+to+Login&href=%2Fvolunteer_login.html');
    }

    req.session.volunteer = volunteer;
    console.log('Volunteer login successful, redirecting to dashboard...');
    res.redirect('/volunteer/dashboard.html');
  } catch (err) {
    console.error('=== VOLUNTEER LOGIN ERROR ===');
    console.error('Error details:', err);
    res.redirect('/confirmation.html?title=Login+Error&text=An+error+occurred+during+login.+Please+try+again.&btn=Back+to+Login&href=%2Fvolunteer_login.html');
  }
});

// Admin Login
app.post('/admin/login', async (req, res) => {
  console.log('=== ADMIN LOGIN START ===');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  const { username, password } = req.body;
  console.log('Extracted username:', username);

  try {
    const admin = await Admin.findOne({ username });
    console.log('Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      console.log('Admin not found, redirecting...');
      return res.redirect('/confirmation.html?title=Admin+Not+Found&text=No+admin+account+found+with+that+username.&btn=Try+Again&href=%2Fadmin_login.html');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password incorrect, redirecting...');
      return res.redirect('/confirmation.html?title=Incorrect+Password&text=The+password+you+entered+is+incorrect.&btn=Try+Again&href=%2Fadmin_login.html');
    }

    req.session.admin = admin;
    console.log('Admin login successful, redirecting to dashboard...');
    res.redirect('/admin/dashboard.html');
  } catch (err) {
    console.error('=== ADMIN LOGIN ERROR ===');
    console.error('Error details:', err);
    res.redirect('/confirmation.html?title=Server+Error&text=An+error+occurred+during+login.+Please+try+again.&btn=Back+to+Login&href=%2Fadmin_login.html');
  }
});

// Get all pending volunteers
app.get('/admin/volunteers/pending', async (req, res) => {
  try {
    const pending = await Volunteer.find({ status: 'pending' });
    res.json(pending);
  } catch (err) {
    res.status(500).send('❌ Failed to fetch pending volunteers');
  }
});

// Approve or reject a volunteer
app.post('/admin/volunteers/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    if (status === 'rejected') {
      await Volunteer.findByIdAndDelete(id);
      res.send('✅ Volunteer rejected and removed');
    } else {
      await Volunteer.findByIdAndUpdate(id, { status });
      res.send(`✅ Volunteer ${status}`);
    }
  } catch (err) {
    res.status(500).send('❌ Failed to update volunteer status');
  }
});

app.get('/admin/add_activity.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/admin/add_activity.html'));
});

app.get('/admin/feedbacks.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/admin/feedbacks.html'));
});

// Admin endpoint to get all feedbacks
app.get('/admin/feedbacks/all', async (req, res) => {
  try {
    console.log('=== ADMIN GETTING ALL FEEDBACKS ===');
    const Feedback = require('./models/Feedback');
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    console.log('Found feedbacks:', feedbacks.length);
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Admin endpoint to reply to feedback
app.post('/admin/feedbacks/:id/reply', async (req, res) => {
  try {
    console.log('=== ADMIN REPLYING TO FEEDBACK ===');
    console.log('Feedback ID:', req.params.id);
    console.log('Reply data:', req.body);
    
    const { id } = req.params;
    const { reply } = req.body;
    
    const Feedback = require('./models/Feedback');
    const feedback = await Feedback.findByIdAndUpdate(id, { reply }, { new: true });
    
    if (!feedback) {
      console.log('Feedback not found');
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    console.log('Feedback updated successfully');
    
    // Send email TO the user who submitted the feedback
    try {
      const { sendEmail } = require('./services/emailNotifier');
      const subject = 'Reply to your feedback - Lovely Nursing Home';
      const emailBody = `Dear ${feedback.name},\n\nThank you for your feedback. Here is our response:\n\n${reply}\n\nBest regards,\nLovely Nursing Home Team`;
      
      await sendEmail(feedback.email, subject, emailBody);
      console.log('Reply email sent to user:', feedback.email);
    } catch (emailError) {
      console.error('Failed to send reply email:', emailError);
      // Don't fail the reply if email fails
    }
    
    res.json({ message: 'Reply sent and saved', feedback });
  } catch (error) {
    console.error('Error replying to feedback:', error);
    res.status(500).json({ message: 'Error replying to feedback', error: error.message });
  }
});

app.use('/admin', adminRoutes);
app.use('/volunteer', volunteerRoutes);
app.use('/donate', donateRoutes);
// Test endpoint for feedback
app.get('/test-feedback', async (req, res) => {
  try {
    const Feedback = require('./models/Feedback');
    const count = await Feedback.countDocuments();
    res.json({ message: 'Feedback test endpoint working', count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/feedback', feedbackRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/donor', donorRoutes);

// Public endpoint to get donation target (for homepage)
app.get('/api/donation-target', async (req, res) => {
  try {
    const DonationTarget = require('./models/DonationTarget');
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    let target = await DonationTarget.findOne({ month: currentMonth });
    
    if (!target) {
      // If no target for current month, get the most recent target
      target = await DonationTarget.findOne().sort({ createdAt: -1 });
    }
    
    res.json({ target: target ? target.target : null });
  } catch (error) {
    console.error('Error fetching donation target:', error);
    res.status(500).json({ error: 'Failed to fetch donation target' });
  }
});

// Debug endpoint to check activities in database
app.get('/debug-activities', async (req, res) => {
  try {
    const allActivities = await Activity.find();
    const activeActivities = await Activity.find({ status: 'active' });
    const futureActivities = await Activity.find({ 
      status: 'active',
      date: { $gte: new Date() }
    });
    
    res.json({
      totalActivities: allActivities.length,
      activeActivities: activeActivities.length,
      futureActivities: futureActivities.length,
      allActivities: allActivities,
      activeActivitiesList: activeActivities,
      futureActivitiesList: futureActivities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the app to be used in index.js
module.exports = app;