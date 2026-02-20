const express = require("express");
const router = express.Router();
const {
  createStaffVisit,
  getStaffVisits,
  getStaffVisit,
  updateStaffVisit,
  deleteStaffVisit,
} = require("../controllers/staffVisitController");
const { protectAdmin } = require("../middleware/authMiddleware");

router.route("/").post(createStaffVisit).get(protectAdmin, getStaffVisits);

router
  .route("/:id")
  .get(protectAdmin, getStaffVisit)
  .put(protectAdmin, updateStaffVisit)
  .delete(protectAdmin, deleteStaffVisit);

module.exports = router;