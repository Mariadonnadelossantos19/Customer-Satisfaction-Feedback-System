const CustomerProfile = require("../models/CustomerProfile");

// Create new customer profile
const createCustomerProfile = async (req, res) => {
  try {
    const customerProfile = await CustomerProfile.create(req.body);
    res.status(201).json(customerProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get customer profile by staff visit ID
const getCustomerProfileByVisit = async (req, res) => {
  try {
    const customerProfile = await CustomerProfile.findOne({
      staffVisit: req.params.visitId,
    });
    if (!customerProfile) {
      return res.status(404).json({ message: "Customer profile not found" });
    }
    res.status(200).json(customerProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update customer profile
const updateCustomerProfile = async (req, res) => {
  try {
    const customerProfile = await CustomerProfile.findOneAndUpdate(
      { staffVisit: req.params.visitId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!customerProfile) {
      return res.status(404).json({ message: "Customer profile not found" });
    }
    res.status(200).json(customerProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete customer profile
const deleteCustomerProfile = async (req, res) => {
  try {
    const customerProfile = await CustomerProfile.findOneAndDelete({
      staffVisit: req.params.visitId,
    });
    if (!customerProfile) {
      return res.status(404).json({ message: "Customer profile not found" });
    }
    res.status(200).json({ message: "Customer profile deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCustomerProfile,
  getCustomerProfileByVisit,
  updateCustomerProfile,
  deleteCustomerProfile,
};
