const LibraryUserFeedback = require("../models/LibraryUserFeedback");

// Create new library user feedback
const createLibraryUserFeedback = async (req, res) => {
  try {
    const libraryFeedback = await LibraryUserFeedback.create(req.body);
    res.status(201).json(libraryFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all library user feedbacks
const getLibraryUserFeedbacks = async (req, res) => {
  try {
    const libraryFeedbacks = await LibraryUserFeedback.find({})
      .populate("customerFeedback")
      .populate("staffVisit")
      .sort({ createdAt: -1 });
    res.status(200).json(libraryFeedbacks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single library user feedback
const getLibraryUserFeedback = async (req, res) => {
  try {
    const libraryFeedback = await LibraryUserFeedback.findById(req.params.id)
      .populate("customerFeedback")
      .populate("staffVisit");

    if (!libraryFeedback) {
      return res.status(404).json({ message: "Library feedback not found" });
    }
    res.status(200).json(libraryFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createLibraryUserFeedback,
  getLibraryUserFeedbacks,
  getLibraryUserFeedback,
};
