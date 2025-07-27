const mongoose = require('mongoose');
const Activity = require('../models/Activity');

// MongoDB connection
const mongoUri = 'mongodb+srv://whaiqal7:Wanzack123@lovelynursinghome.sbhoe2w.mongodb.net/lovely_nursing_home?retryWrites=true&w=majority&appName=LovelyNursingHome';

async function restoreOriginalActivities() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing activities
    await Activity.deleteMany({});
    console.log('Cleared existing activities');

    // Add original activities with future dates
    const originalActivities = [
      {
        title: 'Gotong-Royong',
        description: 'Mari sertai kami dalam aktiviti gotong-royong membersihkan dan menceriakan taman komuniti. Sukarelawan akan membantu mencabut rumput liar, membersihkan sampah, dan menanam bunga untuk menceriakan persekitaran.',
        date: new Date('2025-12-15'), // Future date
        time: '09:35',
        slots: 11,
        image: '/images/photo1.jpg',
        status: 'active'
      },
      {
        title: 'Sesi Senam Ringan & Bersantai Bersama Warga Emas',
        description: 'Jom sertai kami dalam aktiviti sukarelawan di rumah penjagaan warga emas! Kami akan mengadakan sesi senam ringan bersama warga emas untuk membantu mereka kekal sihat dan aktif.',
        date: new Date('2025-12-20'), // Future date
        time: '08:30',
        slots: 12,
        image: '/images/photo2.jpg',
        status: 'active'
      },
      {
        title: 'Bengkel Seni & Kraf Bersama Warga Emas',
        description: 'Ayuh sertai kami dalam bengkel seni & kraf bersama warga emas di rumah penjagaan. Dalam sesi ini, sukarelawan akan membantu warga emas melukis, membuat kraftangan, dan berkongsi pengalaman kreatif.',
        date: new Date('2025-12-25'), // Future date
        time: '14:30',
        slots: 10,
        image: '/images/photo3.jpg',
        status: 'active'
      }
    ];

    const savedActivities = await Activity.insertMany(originalActivities);
    console.log('Restored original activities:', savedActivities.length);
    
    savedActivities.forEach(activity => {
      console.log(`- ${activity.title} (${activity.date.toDateString()}) - ${activity.slots} slots`);
    });

    console.log('Original activities restored successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error restoring original activities:', error);
    process.exit(1);
  }
}

restoreOriginalActivities(); 