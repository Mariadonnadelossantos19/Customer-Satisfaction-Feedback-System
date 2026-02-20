const express = require('express');
const router = express.Router();
const {
  getReviewSummary,
} = require('../controllers/reviewSummaryController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/:staffVisitId/:customerFeedbackId', protectAdmin, getReviewSummary);

module.exports = router;