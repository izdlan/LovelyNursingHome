/**
 * Lovely Nursing Home - Main Entry Point
 * This file serves as the entry point for the application.
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// MongoDB connection string
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://whaiqal7:Wanzack123@lovelynursinghome.sbhoe2w.mongodb.net/lovely_nursing_home?retryWrites=true&w=majority&appName=LovelyNursingHome';

console.log('=== MONGODB CONNECTION START ===');
console.log('MongoDB URI:', MONGO_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    console.log("Database name:", mongoose.connection.name);
    console.log("Connection ready state:", mongoose.connection.readyState);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("Full error:", err);
  });

// Import the Express app from backend/server.js
const app = require('./backend/server');

// Add additional debugging routes
app.get('/test-connection', (req, res) => {
  res.send('Server connection test successful!');
});

// Add MongoDB connection test route
app.get('/test-mongodb', async (req, res) => {
  try {
    const Feedback = require('./backend/models/Feedback');
    const count = await Feedback.countDocuments();
    res.json({ 
      message: 'MongoDB connection successful', 
      feedbackCount: count,
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'MongoDB connection failed', 
      message: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Add a catch-all route for HTML files (but not API routes)
app.get('*.html', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/') || req.path.startsWith('/admin/') || 
      req.path.startsWith('/volunteer/') || req.path.startsWith('/feedback') ||
      req.path.startsWith('/donate') || req.path.startsWith('/donor')) {
    return res.status(404).send('API route not found');
  }
  
  const filePath = path.join(__dirname, 'frontend/public', req.path);
  console.log('Requested HTML file:', filePath);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found: ' + req.path);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`Static files being served from: ${path.join(__dirname, 'frontend/public')}`);
}); 