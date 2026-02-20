const express = require("express");
const router = express.Router();
const {
  createCustomerFeedback,
  getCustomerFeedbacks,
  getCustomerFeedback,
  updateCustomerFeedback,
  deleteCustomerFeedback,
} = require("../controllers/customerFeedbackController");
const { protectAdmin } = require("../middleware/authMiddleware");

router.route("/").post(createCustomerFeedback).get(protectAdmin, getCustomerFeedbacks);

router
  .route("/:id")
  .get(protectAdmin, getCustomerFeedback)
  .put(protectAdmin, updateCustomerFeedback)
  .delete(protectAdmin, deleteCustomerFeedback);

module.exports = router;