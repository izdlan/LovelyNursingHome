const donorDao = require('../dao/donorDao');

exports.addDonor = async (req, res) => {
  try {
    const donor = await donorDao.createDonor(req.body);
    res.redirect('/confirmation.html?title=Donor+Added!&text=Donor+added+successfully.&btn=Back+to+Donors&href=%2Fadmin%2Fdonors.html');
  } catch (error) {
    console.error('Error adding donor:', error);
    res.redirect('/confirmation.html?title=Error!&text=Error+adding+donor.&btn=Back+to+Donors&href=%2Fadmin%2Fdonors.html');
  }
};

exports.getAllDonors = async (req, res) => {
  try {
    const donors = await donorDao.getAllDonors();
    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ error: 'Error fetching donors' });
  }
};

exports.getDonorById = async (req, res) => {
  try {
    const donor = await donorDao.getDonorById(req.params.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({ error: 'Error fetching donor' });
  }
};

exports.updateDonor = async (req, res) => {
  try {
    const donor = await donorDao.updateDonor(req.params.id, req.body);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    console.error('Error updating donor:', error);
    res.status(500).json({ error: 'Error updating donor' });
  }
};

exports.deleteDonor = async (req, res) => {
  try {
    const donor = await donorDao.deleteDonor(req.params.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({ error: 'Error deleting donor' });
  }
};

exports.searchDonors = async (req, res) => {
  try {
    const { email, nric } = req.query;
    let donors = [];
    
    if (email && nric) {
      const donor = await donorDao.findDonorByEmailAndNric(email, nric);
      if (donor) donors.push(donor);
    } else if (email) {
      const donor = await donorDao.findDonorByEmail(email);
      if (donor) donors.push(donor);
    } else if (nric) {
      const donor = await donorDao.findDonorByNric(nric);
      if (donor) donors.push(donor);
    } else {
      donors = await donorDao.getAllDonors();
    }
    
    res.json(donors);
  } catch (error) {
    console.error('Error searching donors:', error);
    res.status(500).json({ error: 'Error searching donors' });
  }
}; 