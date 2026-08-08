const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { protect, admin } = require('../middleware/auth');

// Get active offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create offer
router.post('/', protect, admin, async (req, res) => {
  try {
    const createdOffer = await Offer.create(req.body);
    res.status(201).json(createdOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
