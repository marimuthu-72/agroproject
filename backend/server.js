const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDB } = require('./config/db');

dotenv.config();

const app = express();

// Initialize MySQL Database Pool and Auto Schema
initDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/inquiries', require('./routes/inquiries'));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback API message route
app.get('/api', (req, res) => {
  res.json({ message: 'G. Saravana Agro Clinic MySQL API Server is running smoothly' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
