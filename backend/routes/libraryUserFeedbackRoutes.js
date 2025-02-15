const express = require("express");
const router = express.Router();
const {
  createLibraryUserFeedback,
  getLibraryUserFeedbacks,
  getLibraryUserFeedback,
} = require("../controllers/libraryUserFeedbackController");

router.route("/").post(createLibraryUserFeedback).get(getLibraryUserFeedbacks);

router.route("/:id").get(getLibraryUserFeedback);

module.exports = router;