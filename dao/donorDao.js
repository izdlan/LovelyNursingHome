const Donor = require('../models/Donor');

class DonorDao {
  async createDonor(donorData) {
    const donor = new Donor(donorData);
    return await donor.save();
  }

  async getAllDonors() {
    return await Donor.find().sort({ createdAt: -1 });
  }

  async getDonorById(id) {
    return await Donor.findById(id);
  }

  async updateDonor(id, updateData) {
    return await Donor.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteDonor(id) {
    return await Donor.findByIdAndDelete(id);
  }

  async findDonorByEmail(email) {
    return await Donor.findOne({ email });
  }

  async findDonorByNric(nric) {
    return await Donor.findOne({ nric });
  }

  async findDonorByEmailAndNric(email, nric) {
    return await Donor.findOne({ email, nric });
  }
}

module.exports = new DonorDao(); 