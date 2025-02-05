const StaffVisit = require("../models/StaffVisit");

// Create new staff visit record
const createStaffVisit = async (req, res) => {
  try {
    const staffVisit = await StaffVisit.create(req.body);
    res.status(201).json(staffVisit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all staff visits
const getStaffVisits = async (req, res) => {
  try {
    const staffVisits = await StaffVisit.find({})
      .populate("customerProfile")
      .sort({ dateOfVisit: -1 });
    res.status(200).json(staffVisits);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single staff visit
const getStaffVisit = async (req, res) => {
  try {
    const staffVisit = await StaffVisit.findById(req.params.id).populate(
      "customerProfile"
    );

    if (!staffVisit) {
      return res.status(404).json({ message: "Visit record not found" });
    }
    res.status(200).json(staffVisit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update staff visit
const updateStaffVisit = async (req, res) => {
  try {
    const staffVisit = await StaffVisit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!staffVisit) {
      return res.status(404).json({ message: "Visit record not found" });
    }
    res.status(200).json(staffVisit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete staff visit
const deleteStaffVisit = async (req, res) => {
  try {
    const staffVisit = await StaffVisit.findById(req.params.id);
    if (!staffVisit) {
      return res.status(404).json({ message: "Visit record not found" });
    }

    // Remove will trigger the pre-remove middleware
    await staffVisit.remove();
    res
      .status(200)
      .json({
        message:
          "Visit record and associated customer profile deleted successfully",
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createStaffVisit,
  getStaffVisits,
  getStaffVisit,
  updateStaffVisit,
  deleteStaffVisit,
};
