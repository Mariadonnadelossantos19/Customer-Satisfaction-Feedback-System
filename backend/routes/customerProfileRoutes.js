const express = require("express");
const router = express.Router();
const {
  createCustomerProfile,
  getCustomerProfileByVisit,
  updateCustomerProfile,
  deleteCustomerProfile,
} = require("../controllers/customerProfileController");

router.post("/", createCustomerProfile);
router.get("/visit/:visitId", getCustomerProfileByVisit);
router.put("/visit/:visitId", updateCustomerProfile);
router.delete("/visit/:visitId", deleteCustomerProfile);

module.exports = router;
