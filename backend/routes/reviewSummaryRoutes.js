const express = require('express');
const router = express.Router();
const {
  getReviewSummary,
} = require('../controllers/reviewSummaryController');

router.get('/:staffVisitId/:customerFeedbackId', getReviewSummary);

module.exports = router;