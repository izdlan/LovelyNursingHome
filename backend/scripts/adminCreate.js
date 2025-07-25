// scripts/adminCreate.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin'); // Adjust path if your model is elsewhere

// ✅ MongoDB connection string
const MONGO_URI = 'mongodb+srv://whaiqal7:Wanzack123@lovelynursinghome.sbhoe2w.mongodb.net/lovely_nursing_home?retryWrites=true&w=majority&appName=LovelyNursingHome';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword
    });
    await admin.save();
    console.log('✅ Admin created');
  } catch (err) {
    console.error('❌ Failed to create admin:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();