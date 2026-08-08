-- ==========================================================================
-- G. Saravana Agro Clinic - MySQL Database Schema (agriproject_db)
-- ==========================================================================

CREATE DATABASE IF NOT EXISTS agriproject_db;
USE agriproject_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT '',
  street VARCHAR(255) DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  state VARCHAR(100) DEFAULT '',
  zip_code VARCHAR(20) DEFAULT '',
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ta VARCHAR(255) DEFAULT '',
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2) DEFAULT 0,
  image VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  description_ta TEXT,
  short_description TEXT,
  stock INT DEFAULT 100,
  rating DECIMAL(3, 2) DEFAULT 4.8,
  reviews_count INT DEFAULT 12,
  is_featured TINYINT(1) DEFAULT 0,
  is_bestseller TINYINT(1) DEFAULT 0,
  composition VARCHAR(255) DEFAULT 'N-P-K Formula',
  usage_guide TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY user_product_unique (user_id, product_id)
);

-- 5. Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY user_cart_unique (user_id, product_id)
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  custom_order_id VARCHAR(100) NOT NULL UNIQUE,
  user_id INT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255) DEFAULT '',
  shipping_address JSON NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Razorpay',
  payment_status ENUM('Pending', 'Paid', 'Completed', 'Failed', 'Cancelled') DEFAULT 'Pending',
  order_status ENUM('Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_fee DECIMAL(10, 2) DEFAULT 0,
  razorpay_order_id VARCHAR(255) DEFAULT '',
  razorpay_payment_id VARCHAR(255) DEFAULT '',
  razorpay_signature VARCHAR(255) DEFAULT '',
  transaction_id VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  image VARCHAR(500) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- 8. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  order_id VARCHAR(100) NOT NULL,
  user_id INT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255) DEFAULT '',
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Razorpay',
  payment_gateway VARCHAR(50) DEFAULT 'Razorpay',
  gateway_order_id VARCHAR(255) DEFAULT '',
  gateway_payment_id VARCHAR(255) DEFAULT '',
  gateway_signature VARCHAR(255) DEFAULT '',
  status ENUM('Success', 'Failed', 'Cancelled', 'Pending') DEFAULT 'Pending',
  failure_reason TEXT,
  signature_verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Offers / Coupons Table
CREATE TABLE IF NOT EXISTS offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ta VARCHAR(255) DEFAULT '',
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_percentage INT NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'Latest Discounts',
  valid_until DATETIME DEFAULT NULL,
-- 10. Customer Inquiries / Support Messages Table
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) DEFAULT '',
  subject VARCHAR(255) DEFAULT 'General Support',
  message TEXT NOT NULL,
  status ENUM('New', 'In Progress', 'Resolved') DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

