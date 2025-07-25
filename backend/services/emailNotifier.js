const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');

// MongoDB connection string
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://whaiqal7:Wanzack123@lovelynursinghome.sbhoe2w.mongodb.net/lovely_nursing_home?retryWrites=true&w=majority&appName=LovelyNursingHome';

async function migrateDonors() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB Atlas");

    // Get all donations
    const donations = await Donation.find({});
    console.log(`📊 Found ${donations.length} donations to process`);

    let donorsCreated = 0;
    let donorsSkipped = 0;
    const uniqueDonors = new Map(); // Use Map to track unique donors by email + nric

    // Process each donation
    for (const donation of donations) {
      // Check if donor info exists
      if (!donation.email || !donation.nric) {
        console.log(`⚠️ Skipping donation ${donation._id} - missing email or nric`);
        donorsSkipped++;
        continue;
      }

      // Create unique key for donor (email + nric)
      const donorKey = `${donation.email}-${donation.nric}`;

      // Check if we already processed this donor
      if (uniqueDonors.has(donorKey)) {
        console.log(`⏭️ Skipping duplicate donor: ${donation.email}`);
        donorsSkipped++;
        continue;
      }

      // Check if donor already exists in Donor collection
      const existingDonor = await Donor.findOne({ 
        email: donation.email, 
        nric: donation.nric 
      });

      if (existingDonor) {
        console.log(`⏭️ Donor already exists: ${donation.email}`);
        uniqueDonors.set(donorKey, existingDonor._id);
        donorsSkipped++;
        continue;
      }

      // Create new donor
      const donorData = {
        title: donation.title || '',
        surname: donation.surname || '',
        given_name: donation.given_name || '',
        nric: donation.nric,
        contact: donation.contact || '',
        email: donation.email
      };

      const newDonor = new Donor(donorData);
      await newDonor.save();

      uniqueDonors.set(donorKey, newDonor._id);
      donorsCreated++;

      console.log(`✅ Created donor: ${donorData.email} (${donorData.given_name} ${donorData.surname})`);
    }

    console.log("\n📈 Migration Summary:");
    console.log(`✅ Donors created: ${donorsCreated}`);
    console.log(`⏭️ Donors skipped: ${donorsSkipped}`);
    console.log(`📊 Total unique donors: ${uniqueDonors.size}`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");

  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateDonors();
}

module.exports = migrateDonors; 