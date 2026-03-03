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

// Get all staff visits (filter by province for PSTO admin)
const getStaffVisits = async (req, res) => {
  try {
    const query = {};
    if (req.admin && req.admin.role === "psto_admin" && req.admin.province) {
      query.province = req.admin.province;
    }
    const staffVisits = await StaffVisit.find(query)
      .populate("customerProfile")
      .populate({
        path: "customerProfile",
        populate: {
          path: "customerFeedback"
        }
      })
      .sort({ dateOfVisit: -1 });
    res.status(200).json(staffVisits);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single staff visit (PSTO admin can only access their province)
const getStaffVisit = async (req, res) => {
  try {
    const staffVisit = await StaffVisit.findById(req.params.id).populate(
      "customerProfile"
    );

    if (!staffVisit) {
      return res.status(404).json({ message: "Visit record not found" });
    }
    if (req.admin && req.admin.role === "psto_admin" && req.admin.province && staffVisit.province !== req.admin.province) {
      return res.status(403).json({ message: "Access denied. This record belongs to another province." });
    }
    res.status(200).json(staffVisit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update staff visit (PSTO admin can only update their province)
const updateStaffVisit = async (req, res) => {
  try {
    const existing = await StaffVisit.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Visit record not found" });
    }
    if (req.admin && req.admin.role === "psto_admin" && req.admin.province && existing.province !== req.admin.province) {
      return res.status(403).json({ message: "Access denied. This record belongs to another province." });
    }
    const staffVisit = await StaffVisit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(staffVisit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete staff visit (PSTO admin can only delete their province)
const deleteStaffVisit = async (req, res) => {
  try {
    const staffVisit = await StaffVisit.findById(req.params.id);
    if (!staffVisit) {
      return res.status(404).json({ message: "Visit record not found" });
    }
    if (req.admin && req.admin.role === "psto_admin" && req.admin.province && staffVisit.province !== req.admin.province) {
      return res.status(403).json({ message: "Access denied. This record belongs to another province." });
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
