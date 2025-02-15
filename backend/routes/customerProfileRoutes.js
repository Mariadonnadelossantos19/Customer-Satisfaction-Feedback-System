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

// GET all customer profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await CustomerProfile.find(); // Fetch all customer profiles
    res.json(profiles);
  } catch (error) {
    console.error("Error fetching customer profiles:", error);
    res.status(500).json({ message: "An error occurred while fetching customer profiles." });
  }
});

module.exports = router;