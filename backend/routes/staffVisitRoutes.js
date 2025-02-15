const express = require("express");
const router = express.Router();
const {
  createStaffVisit,
  getStaffVisits,
  getStaffVisit,
  updateStaffVisit,
  deleteStaffVisit,
} = require("../controllers/staffVisitController");

router.route("/").post(createStaffVisit).get(getStaffVisits);

router
  .route("/:id")
  .get(getStaffVisit)
  .put(updateStaffVisit)
  .delete(deleteStaffVisit);

module.exports = router;