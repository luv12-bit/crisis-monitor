const express = require('express');
const Alert   = require('../models/Alert');
const router  = express.Router();

// Subscribe to a region
router.post('/subscribe', async (req, res) => {
  try {
    const { region, countryCode, threshold, userEmail } = req.body;
    const existing = await Alert.findOne({ countryCode, userEmail });
    if (existing) return res.status(400).json({ message: 'Already subscribed to this region' });
    const alert = await Alert.create({ region, countryCode, threshold: threshold || 70, userEmail, isActive: true });
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all subscriptions for a user
router.get('/my/:email', async (req, res) => {
  try {
    const alerts = await Alert.find({ userEmail: req.params.email });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete subscription
router.delete('/:id', async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;