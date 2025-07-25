/**
 * Lovely Nursing Home - Main Entry Point
 * This file serves as the entry point for the application.
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// MongoDB connection string - use environment variable in production
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://whaiqal7:Wanzack123@lovelynursinghome.sbhoe2w.mongodb.net/lovely_nursing_home?retryWrites=true&w=majority&appName=LovelyNursingHome';

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    // Don't crash the app on connection error
  });

// Add connection error handler
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Import the Express app from backend/server.js
const app = require('./backend/server');

// Add additional debugging routes
app.get('/test-connection', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.send(`Server connection test successful! Database: ${dbStatus}`);
});

// Add a catch-all route for HTML files
app.get('*.html', (req, res) => {
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