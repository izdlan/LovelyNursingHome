const cron = require('node-cron');
const Donation = require('../models/Donation');
const nodemailer = require('nodemailer');

// Configure your email transport (example: Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '2022495772@student.uitm.edu.my',
    pass: 'ectciutlcwetcfnf' // Use App Password for Gmail
  }
});

// Helper to send email
const sendEmail = (to, subject, text) => {
  return transporter.sendMail({
    from: '"Lovely Nursing Home" <2022495772@student.uitm.edu.my>',
    to,
    subject,
    text
  });
};

// Schedule: At 09:00 on the 1st day of every month //every one minute-('* * * * *')
cron.schedule('0 9 1 * *', async () => {
  const monthlyDonors = await Donation.find({ donation_type: 'monthly' });
  for (const donor of monthlyDonors) {
    if (donor.email) {
      await sendEmail(
        donor.email,
        'Thank You for Your Monthly Support!',
        `Hi ${donor.given_name || ''}, thank you for your monthly support to Lovely Nursing Home!`
      );
    }
  }
});

module.exports = { sendEmail }; 