const mongoose = require('mongoose');
const DonationTarget = require('../models/DonationTarget');

// MongoDB connection
const mongoUri = 'mongodb+srv://whaiqal7:Wanzack123@lovelynursinghome.sbhoe2w.mongodb.net/lovely_nursing_home?retryWrites=true&w=majority&appName=LovelyNursingHome';

async function addDonationTarget() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    console.log('Current month:', currentMonth);

    // Check if target already exists for current month
    let existingTarget = await DonationTarget.findOne({ month: currentMonth });
    
    if (existingTarget) {
      console.log('Target already exists for current month:', existingTarget.target);
      console.log('Updating to RM 4,000...');
      existingTarget.target = 4000;
      await existingTarget.save();
      console.log('Target updated successfully!');
    } else {
      // Create new target for current month
      const newTarget = new DonationTarget({
        target: 4000,
        month: currentMonth
      });
      
      await newTarget.save();
      console.log('New donation target created: RM 4,000 for', currentMonth);
    }

    // Show all targets
    const allTargets = await DonationTarget.find().sort({ createdAt: -1 });
    console.log('\nAll donation targets:');
    allTargets.forEach(target => {
      console.log(`- ${target.month}: RM ${target.target.toLocaleString()}`);
    });

    console.log('\nDonation target setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up donation target:', error);
    process.exit(1);
  }
}

addDonationTarget(); 