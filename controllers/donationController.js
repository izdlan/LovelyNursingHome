const donationDao = require('../dao/donationDao');

exports.donate = async (req, res) => {
  try {
    const { donation_amount } = req.body;
    if (donation_amount <= 0) {
      return res.status(400).send('Donation amount must be greater than zero.');
    }
    const donationData = { ...req.body, donation_date: new Date() };
    await donationDao.createDonation(donationData);
    res.redirect('/confirmation.html?title=Thank+You!&text=Your+donation+was+submitted+successfully.&btn=Donate+Again&href=%2Fdonate.html');
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