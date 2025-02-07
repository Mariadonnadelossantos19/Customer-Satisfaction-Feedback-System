const StaffVisit = require('../models/StaffVisit');
const CustomerProfile = require('../models/CustomerProfile');
const CustomerFeedback = require('../models/CustomerFeedback');
const LibraryUserFeedback = require('../models/LibraryUserFeedback');

const getReviewSummary = async (req, res) => {
  const { staffVisitId, customerFeedbackId } = req.params;

  try {
    const staffVisit = await StaffVisit.findById(staffVisitId);
    const customerProfile = await CustomerProfile.findOne({ staffVisit: staffVisitId });
    const customerFeedback = await CustomerFeedback.findById(customerFeedbackId);
    const libraryFeedback = await LibraryUserFeedback.findOne({ staffVisit: staffVisitId });

    res.status(200).json({
      staffVisit,
      customerProfile,
      customerFeedback,
      libraryFeedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviewSummary,
};
