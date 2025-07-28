const donationDao = require('../dao/donationDao');

exports.donate = async (req, res) => {
  try {
    const { donation_amount } = req.body;
    if (donation_amount <= 0) {
      return res.status(400).send('Donation amount must be greater than zero.');
    }
    
    // Generate receipt ID
    const receiptId = 'LNH' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const donationData = { 
      ...req.body, 
      donation_date: new Date(),
      receipt_id: receiptId
    };
    
    const savedDonation = await donationDao.createDonation(donationData);
    
    // Prepare receipt data for confirmation page
    const donorName = req.body.consent === 'yes' ? 
      `${req.body.title || ''} ${req.body.surname} ${req.body.given_name}`.trim() : 
      'Anonymous';
    
    const receiptParams = new URLSearchParams({
      title: 'Thank You for Your Donation!',
      receiptId: receiptId,
      donorName: donorName,
      amount: donation_amount,
      donationType: req.body.donation_type,
      paymentMode: req.body.payment_mode,
      date: new Date().toLocaleDateString('en-MY'),
      email: req.body.email || '',
      btn: 'Donate Again',
      href: '/donate.html'
    });
    
    res.redirect(`/confirmation.html?${receiptParams.toString()}`);
  } catch (err) {
    res.status(500).send('Error submitting donation: ' + err.message);
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await require('../models/Donation').find();
    res.json(donations);
  } catch (err) {
    res.status(500).send('Error fetching donations: ' + err.message);
  }
}; 