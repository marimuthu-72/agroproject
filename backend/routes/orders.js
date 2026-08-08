const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// Create order endpoint
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, customerName, customerPhone, customerEmail, discountAmount } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const createdOrder = await Order.create({
      user: req.user ? req.user._id : null,
      customerName: customerName || (req.user ? req.user.name : 'Valued Farmer'),
      customerPhone: customerPhone || (req.user ? req.user.phone : ''),
      customerEmail: customerEmail || (req.user ? req.user.email : ''),
      items,
      shippingAddress,
      paymentMethod,
      discountAmount
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch single order details by customOrderId or numeric id
router.get('/by-id/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    let order = await Order.findOne({ customOrderId: orderId });
    if (!order && !isNaN(orderId)) {
      order = await Order.findById(parseInt(orderId));
    }
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (for Admin & Live Order Panel)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const targetId = req.params.id;
    let order = await Order.findOne({ customOrderId: targetId });
    if (!order && !isNaN(targetId)) {
      order = await Order.findById(parseInt(targetId));
    }

    if (order) {
      const updateData = {};
      if (req.body.status || req.body.orderStatus) updateData.orderStatus = req.body.status || req.body.orderStatus;
      if (req.body.paymentStatus) updateData.paymentStatus = req.body.paymentStatus;
      
      const updatedOrder = await Order.updateByCustomOrderId(order.customOrderId, updateData);
      res.json(updatedOrder || order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
