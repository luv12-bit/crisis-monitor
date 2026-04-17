const express = require('express');
const CrisisEvent = require('../models/CrisisEvent');
const Region = require('../models/Region');

const router = express.Router();

// GET all crisis events
router.get('/events', async (req, res) => {
  try {
    const events = await CrisisEvent.find().sort({ eventDate: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET events by country
router.get('/events/:countryCode', async (req, res) => {
  try {
    const events = await CrisisEvent.find({ countryCode: req.params.countryCode });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add a crisis event (admin only for now)
router.post('/events', async (req, res) => {
  try {
    const event = await CrisisEvent.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all regions with risk scores (for heatmap)
router.get('/regions', async (req, res) => {
  try {
    const regions = await Region.find().sort({ riskScore: -1 });
    res.json(regions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add/update a region
router.post('/regions', async (req, res) => {
  try {
    const region = await Region.create(req.body);
    res.status(201).json(region);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;