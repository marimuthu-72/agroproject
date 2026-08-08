const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// Submit Loan / Subsidy Application
router.post('/', async (req, res) => {
  try {
    const { name, phone, aadhaar, loanType, amount, landSize, location, bankAccount, ifsc, purpose } = req.body;
    if (!name || !phone || !amount) {
      return res.status(400).json({ message: 'Name, phone number, and loan amount are required.' });
    }

    const created = await Loan.create({
      name,
      phone,
      aadhaar,
      loanType,
      amount,
      landSize,
      location,
      bankAccount,
      ifsc,
      purpose,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Agri Loan Application submitted successfully!',
      loan: created
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all loan applications
router.get('/', async (req, res) => {
  try {
    const loans = await Loan.find();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update Loan Status (Approved / Rejected / Pending / Under Review)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Loan.updateStatus(req.params.id, status);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
