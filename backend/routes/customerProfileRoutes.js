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
router.get('/all', async (req, res) => {
  try {
    const customers = await CustomerProfile.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer data' });
  }
});

module.exports = router;
