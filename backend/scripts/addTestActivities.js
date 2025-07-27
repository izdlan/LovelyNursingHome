const mongoose = require('mongoose');
const Activity = require('../models/Activity');

// MongoDB connection
const mongoUri = 'mongodb+srv://whaiqal7:Wanzack123@lovelynursinghome.sbhoe2w.mongodb.net/lovely_nursing_home?retryWrites=true&w=majority&appName=LovelyNursingHome';

async function addTestActivities() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing activities
    await Activity.deleteMany({});
    console.log('Cleared existing activities');

    // Add test activities
    const testActivities = [
      {
        title: 'Gotong-Royong Community Cleanup',
        description: 'Mari sertai kami dalam aktiviti gotong-royong membersihkan dan menceriakan taman komuniti. Sukarelawan akan membantu mencabut rumput liar, membersihkan sampah, dan menanam bunga untuk menceriakan persekitaran.',
        date: new Date('2025-07-15'),
        time: '09:35',
        slots: 11,
        image: '/images/photo1.jpg',
        status: 'active'
      },
      {
        title: 'Light Exercise & Relaxation Session with Elderly',
        description: 'Jom sertai kami dalam aktiviti sukarelawan di rumah penjagaan warga emas! Kami akan mengadakan sesi senam ringan bersama warga emas untuk membantu mereka kekal sihat dan aktif.',
        date: new Date('2025-07-20'),
        time: '08:30',
        slots: 12,
        image: '/images/photo2.jpg',
        status: 'active'
      },
      {
        title: 'Art & Craft Workshop with Elderly',
        description: 'Ayuh sertai kami dalam bengkel seni & kraf bersama warga emas di rumah penjagaan. Dalam sesi ini, sukarelawan akan membantu warga emas melukis, membuat kraftangan, dan berkongsi pengalaman kreatif.',
        date: new Date('2025-07-25'),
        time: '14:30',
        slots: 10,
        image: '/images/photo3.jpg',
        status: 'active'
      },
      {
        title: 'Music Therapy Session',
        description: 'Join us for a special music therapy session with our elderly residents. Volunteers will help facilitate singing, playing instruments, and creating a joyful musical atmosphere.',
        date: new Date('2025-08-01'),
        time: '10:00',
        slots: 8,
        image: '/images/photo4.jpg',
        status: 'active'
      }
    ];

    const savedActivities = await Activity.insertMany(testActivities);
    console.log('Added test activities:', savedActivities.length);
    
    savedActivities.forEach(activity => {
      console.log(`- ${activity.title} (${activity.date.toDateString()})`);
    });

    console.log('Test activities added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding test activities:', error);
    process.exit(1);
  }
}

addTestActivities(); 