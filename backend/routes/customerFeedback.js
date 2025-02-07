const express = require('express');
const router = express.Router();
const CustomerFeedback = require('../models/CustomerFeedback');

// Add this route to your existing routes
router.get('/all', async (req, res) => {
  try {
    const feedback = await CustomerFeedback.find()
      .populate('customerProfile')
      .populate('staffVisit')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback data' });
  }
});

module.exports = router; 