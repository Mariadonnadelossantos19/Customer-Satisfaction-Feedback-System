const express = require("express");
const router = express.Router();
const {
  createLibraryUserFeedback,
  getLibraryUserFeedbacks,
  getLibraryUserFeedback,
} = require("../controllers/libraryUserFeedbackController");
const { protectAdmin } = require("../middleware/authMiddleware");

router.route("/").post(createLibraryUserFeedback).get(protectAdmin, getLibraryUserFeedbacks);

router.route("/:id").get(protectAdmin, getLibraryUserFeedback);

module.exports = router;