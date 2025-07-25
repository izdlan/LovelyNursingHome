const volunteerDao = require('../dao/volunteerDao');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const { fullName, email, icnumber, phone, password } = req.body;
    console.log(req.body);
    // Check if volunteer already exists
    const existing = await volunteerDao.findVolunteerByEmail(email);
    if (existing) {
      return res.status(400).send('Volunteer already exists');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    await volunteerDao.createVolunteer({ fullName, email, icnumber, phone, password: hashedPassword });
    res.redirect('/confirmation.html?title=Welcome!&text=Volunteer+registration+submitted+for+approval.&btn=Login&href=%2Fvolunteer_login.html');
  } catch (err) {
    res.status(500).send('Error signing up: ' + err.message);
  }
};

exports.removeVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    await volunteerDao.deleteVolunteer(id);
    res.status(200).send('Volunteer removed');
  } catch (err) {
    res.status(500).send('Error removing volunteer: ' + err.message);
  }
}; 