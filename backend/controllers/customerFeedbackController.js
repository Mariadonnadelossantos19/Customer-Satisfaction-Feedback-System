const CustomerFeedback = require("../models/CustomerFeedback");

// Create new customer feedback
const createCustomerFeedback = async (req, res) => {
  try {
    const customerFeedback = await CustomerFeedback.create(req.body);
    res.status(201).json(customerFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all customer feedbacks
const getCustomerFeedbacks = async (req, res) => {
  try {
    const customerFeedbacks = await CustomerFeedback.find({})
      .populate("customerProfile")
      .populate("staffVisit")
      .sort({ createdAt: -1 });
    res.status(200).json(customerFeedbacks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single customer feedback
const getCustomerFeedback = async (req, res) => {
  try {
    const customerFeedback = await CustomerFeedback.findById(req.params.id)
      .populate("customerProfile")
      .populate("staffVisit");

    if (!customerFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(customerFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update customer feedback
const updateCustomerFeedback = async (req, res) => {
  try {
    const customerFeedback = await CustomerFeedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customerFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(customerFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete customer feedback
const deleteCustomerFeedback = async (req, res) => {
  try {
    const customerFeedback = await CustomerFeedback.findById(req.params.id);
    if (!customerFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    await customerFeedback.deleteOne();
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCustomerFeedback,
  getCustomerFeedbacks,
  getCustomerFeedback,
  updateCustomerFeedback,
  deleteCustomerFeedback,
};
