const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// Submit Customer Inquiry / Message
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Name, phone number, and message are required.' });
    }

    const created = await Inquiry.create({
      name,
      phone,
      email,
      subject,
      message,
      status: 'New'
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully!',
      inquiry: created
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all customer inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find();
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update Inquiry Status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Inquiry.updateStatus(req.params.id, status);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
