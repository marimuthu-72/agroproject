const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'agri_fertilizer_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, city, district } = req.body;
    
    // Auto-generate clean email for phone-based mobile registrations
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    let cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      cleanEmail = cleanPhone ? `${cleanPhone}@farm.in` : `farmer_${Date.now()}@farm.in`;
    }

    // Check if user exists by email or phone
    const allUsers = await User.find();
    const userExists = allUsers.find(u => 
      (u.email && u.email.toLowerCase() === cleanEmail) ||
      (cleanPhone && u.phone && u.phone.replace(/[^0-9]/g, '') === cleanPhone)
    );

    if (userExists) {
      return res.status(200).json({
        _id: userExists._id || userExists.id,
        name: userExists.name,
        email: userExists.email,
        phone: userExists.phone,
        role: userExists.role || 'user',
        token: generateToken(userExists._id || userExists.id),
        message: 'Mobile user logged in successfully'
      });
    }

    const user = await User.create({
      name: name || (cleanPhone ? `Farmer (${cleanPhone.slice(-4)})` : 'Valued Farmer'),
      email: cleanEmail,
      password: password || '123456',
      phone: cleanPhone || phone || '',
      city: city || district || 'Cheranmahadevi',
      role: 'user'
    });

    res.status(201).json({
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id || user.id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Profile
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
