const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const os = require('os');
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

// Helper function to get local IPv4 network address
function getLocalNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  const localIP = getLocalNetworkIP();
  console.log('\n================================================================');
  console.log('  🌱 G. Saravana Agro Clinic E-Commerce & Admin ERP Server');
  console.log('================================================================');
  console.log(`  ► Local Laptop URL:      http://localhost:${PORT}`);
  console.log(`  ► Mobile / Wi-Fi Network: http://${localIP}:${PORT}`);
  console.log('================================================================\n');
});
