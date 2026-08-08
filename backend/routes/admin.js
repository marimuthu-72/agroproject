const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { protect, admin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getAdminConfig, updateAdminConfig } = require('../utils/adminConfig');

// In-memory Rate Limiter for Admin Failed Login Protection
const failedAttemptsMap = new Map();

function getClientKey(req) {
  return req.ip || req.headers['x-forwarded-for'] || 'client_ip';
}

function checkRateLimit(key) {
  const record = failedAttemptsMap.get(key);
  if (!record) return { locked: false };
  if (record.lockoutUntil && Date.now() < record.lockoutUntil) {
    const remainingMins = Math.ceil((record.lockoutUntil - Date.now()) / 60000);
    return { locked: true, remainingMins };
  }
  if (record.lockoutUntil && Date.now() >= record.lockoutUntil) {
    failedAttemptsMap.delete(key);
    return { locked: false };
  }
  return { locked: false };
}

function recordFailedLogin(key) {
  const record = failedAttemptsMap.get(key) || { count: 0, lockoutUntil: null };
  record.count += 1;
  if (record.count >= 5) {
    record.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout after 5 failed attempts
  }
  failedAttemptsMap.set(key, record);
}

function resetRateLimit(key) {
  failedAttemptsMap.delete(key);
}

// Password Complexity Validator
function validatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 lowercase letter (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 number (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 special character (!@#$%^&*).' };
  }
  return { valid: true };
}

// POST /api/admin/login - Secure Admin Login
router.post('/login', async (req, res) => {
  try {
    const clientKey = getClientKey(req);
    const rateLimit = checkRateLimit(clientKey);

    if (rateLimit.locked) {
      return res.status(429).json({
        message: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${rateLimit.remainingMins} minute(s).`
      });
    }

    const { username, password } = req.body || {};

    // Validate presence of username and password
    if (!username || typeof username !== 'string' || !username.trim() ||
        !password || typeof password !== 'string' || !password.trim()) {
      recordFailedLogin(clientKey);
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const config = getAdminConfig();
    const adminUser = config.admin;

    // Strict verification of BOTH username and hashed password
    const isUsernameValid = (username.trim() === adminUser.username);
    const isPasswordValid = isUsernameValid ? await bcrypt.compare(password, adminUser.password) : false;

    if (!isUsernameValid || !isPasswordValid) {
      recordFailedLogin(clientKey);
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    // Reset rate limit on successful authentication
    resetRateLimit(clientKey);

    // Generate JWT Session Token
    const token = jwt.sign(
      { id: 'admin_root', role: 'admin', username: adminUser.username },
      process.env.JWT_SECRET || 'agri_fertilizer_super_secret_jwt_key_2026',
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      username: adminUser.username,
      message: 'Admin authentication successful.'
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error during authentication.' });
  }
});

// GET /api/admin/verify - Verify Admin Token
router.get('/verify', protect, admin, (req, res) => {
  return res.json({
    success: true,
    user: {
      username: req.user.username,
      role: 'admin'
    }
  });
});

// POST /api/admin/change-credentials - Change Admin Username and Password
router.post('/change-credentials', protect, admin, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newUsername || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const config = getAdminConfig();
    const adminUser = config.admin;

    // 1. Verify CURRENT Password
    const isCurrentValid = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isCurrentValid) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // 2. Verify New Passwords Match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match.' });
    }

    // 3. Validate New Username
    const cleanUsername = newUsername.trim();
    if (cleanUsername.length < 3) {
      return res.status(400).json({ message: 'Admin username must be at least 3 characters long.' });
    }

    // 4. Validate Strong Password Requirements
    const pwdCheck = validatePasswordStrength(newPassword);
    if (!pwdCheck.valid) {
      return res.status(400).json({ message: pwdCheck.message });
    }

    // 5. Securely Hash New Password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // 6. Update Configuration File
    updateAdminConfig(cleanUsername, newHashedPassword);

    return res.json({
      success: true,
      message: 'Admin credentials updated successfully! Please login with your new credentials.'
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error updating admin credentials.' });
  }
});

// Admin Analytics Dashboard Summary
router.get('/dashboard-summary', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const orders = await Order.find({ paymentStatus: { $in: ['Paid', 'Completed'] } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const allProducts = await Product.find();
    const lowStockProducts = allProducts.filter(p => (p.stock || 0) < 20);

    const allOrders = await Order.find();
    const recentOrders = allOrders.slice(0, 5);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all customers
router.get('/customers', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all transactions
router.get('/transactions', async (req, res) => {
  try {
    const { status, paymentMethod } = req.query;
    const filter = {};
    if (status && status !== 'ALL') filter.status = status;
    if (paymentMethod && paymentMethod !== 'ALL') filter.paymentMethod = paymentMethod;

    const transactions = await Transaction.find(filter);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get Sales Reports
router.get('/sales-report', async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const successfulTxns = await Transaction.find({ status: 'Success' });
    const failedTxns = await Transaction.countDocuments({ status: 'Failed' });
    const cancelledTxns = await Transaction.countDocuments({ status: 'Cancelled' });

    const totalRevenue = successfulTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
    const successRate = totalTransactions > 0 ? Math.round((successfulTxns.length / totalTransactions) * 100) : 100;

    // Payment method breakdown
    const methodBreakdown = {
      UPI: 0,
      Card: 0,
      NetBanking: 0,
      Wallet: 0,
      Razorpay: 0,
      COD: 0
    };

    successfulTxns.forEach(t => {
      const method = t.paymentMethod || 'Razorpay';
      if (method.includes('UPI')) methodBreakdown.UPI += t.amount;
      else if (method.includes('Card')) methodBreakdown.Card += t.amount;
      else if (method.includes('NetBanking')) methodBreakdown.NetBanking += t.amount;
      else if (method.includes('Wallet')) methodBreakdown.Wallet += t.amount;
      else if (method.includes('COD')) methodBreakdown.COD += t.amount;
      else methodBreakdown.Razorpay += t.amount;
    });

    res.json({
      totalRevenue,
      totalTransactions,
      successfulCount: successfulTxns.length,
      failedCount: failedTxns,
      cancelledCount: cancelledTxns,
      successRate,
      methodBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
