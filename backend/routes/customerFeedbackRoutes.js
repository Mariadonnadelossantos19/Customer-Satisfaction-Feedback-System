const express = require("express");
const router = express.Router();
const {
  createCustomerFeedback,
  getCustomerFeedbacks,
  getCustomerFeedback,
  updateCustomerFeedback,
  deleteCustomerFeedback,
} = require("../controllers/customerFeedbackController");

router.route("/").post(createCustomerFeedback).get(getCustomerFeedbacks);

router
  .route("/:id")
  .get(getCustomerFeedback)
  .put(updateCustomerFeedback)
  .delete(deleteCustomerFeedback);

module.exports = router;
