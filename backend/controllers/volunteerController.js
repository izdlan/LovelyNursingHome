const volunteerDao = require('../dao/volunteerDao');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const { fullName, email, icnumber, phone, password } = req.body;
    console.log(req.body);
    
    // Check for existing volunteer by email
    const existingByEmail = await volunteerDao.findVolunteerByEmail(email);
    if (existingByEmail) {
      return res.status(400).json({ 
        error: 'Email already registered',
        field: 'email'
      });
    }
    
    // Check for existing volunteer by phone
    const existingByPhone = await volunteerDao.findVolunteerByPhone(phone);
    if (existingByPhone) {
      return res.status(400).json({ 
        error: 'Phone number already registered',
        field: 'phone'
      });
    }
    
    // Check for existing volunteer by IC number
    const existingByIC = await volunteerDao.findVolunteerByIC(icnumber);
    if (existingByIC) {
      return res.status(400).json({ 
        error: 'IC number already registered',
        field: 'icnumber'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    await volunteerDao.createVolunteer({ fullName, email, icnumber, phone, password: hashedPassword });
    res.redirect('/confirmation.html?title=Welcome!&text=Volunteer+registration+submitted+for+approval.&btn=Login&href=%2Fvolunteer_login.html');
  } catch (err) {
    res.status(500).json({ error: 'Error signing up: ' + err.message });
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