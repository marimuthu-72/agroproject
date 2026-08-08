-- ==========================================================================
-- G. Saravana Agro Clinic - MySQL Seed Data DML
-- ==========================================================================

USE agriproject_db;

-- 1. Default Admin User (Password: admin123 hashed)
INSERT INTO users (id, name, email, password, phone, role) 
VALUES 
(1, 'Agro Admin', 'admin@agro.com', '$2a$10$wN1QyO/5Qe3g2x1xS4C2.O4u5p8p6wN1QyO/5Qe3g2x1xS4C2.O4u', '9842111223', 'admin'),
(2, 'Ramanathan K.', 'farmer@farm.in', '$2a$10$wN1QyO/5Qe3g2x1xS4C2.O4u5p8p6wN1QyO/5Qe3g2x1xS4C2.O4u', '9842111223', 'user')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Fertilizers', 'Chemical and Soluble Fertilizers'),
(2, 'Organic Fertilizers', 'Natural Vermicompost & Organic Soil Foods'),
(3, 'Bio Fertilizers', 'Microbial Liquid Bio Fertilizers'),
(4, 'Seeds', 'High Yield Hybrid Seeds'),
(5, 'Pesticides', 'Organic & Botanical Crop Protectors'),
(6, 'Plant Growth Promoters', 'Humic Acid & Tonic Growth Boosters'),
(7, 'Farming Equipment', 'Knapsack Sprayers & Irrigation Tools')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Products
INSERT INTO products (id, name, name_ta, category, price, original_price, image, description, description_ta, short_description, stock, rating, reviews_count, is_featured, is_bestseller, composition, usage_guide) VALUES
(1, 'NPK 19-19-19 Water Soluble Fertilizer 1kg', 'NPK 19-19-19 நீரில் கரையும் உரம்', 'Fertilizers', 450.00, 550.00, 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80', '100% water soluble complex fertilizer containing equal proportions of Nitrogen, Phosphorus, and Potassium for healthy crop foliage and root growth.', 'தாவரங்களின் வேர் மற்றும் இலை வளர்ச்சிக்கு ஏற்ற சமச்சீர் ஊட்டச்சத்து உரம்.', 'Balanced 19-19-19 Foliar Spray', 150, 4.90, 18, 1, 1, 'N:19%, P:19%, K:19%', 'Dissolve 5g per liter of water for foliar spray.'),
(2, 'Pure Organic Vermicompost 50kg', 'இயற்கை மண்புழு உரம் 50கிலோ', 'Organic Fertilizers', 650.00, 800.00, 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80', 'Enriched organic vermicompost packed with essential micronutrients, earthworm casts, and natural soil microbes to boost fertility.', 'மண்ணின் வளத்தை அதிகரிக்கும் இயற்கை கரிம மண்புழு உரம்.', 'Rich Earthworm Organic Soil Food', 80, 4.80, 24, 1, 1, 'Organic Carbon 18%, NPK Microbes', 'Apply 200g per plant or 500kg per acre.'),
(3, 'Azospirillum Bio-Fertilizer (1 Liter)', 'அசோஸ்பைரில்லம் உயிர் உரம் (1 லிட்டர்)', 'Bio Fertilizers', 220.00, 280.00, 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80', 'Liquid bio-fertilizer containing atmospheric nitrogen-fixing bacteria suitable for Paddy, Sugarcane, and Pulses.', 'காற்றிலுள்ள நைட்ரஜனை நிலைநிறுத்தும் திரவ உயிர் உரம்.', 'Nitrogen Fixing Liquid Bio Inoculant', 120, 4.70, 15, 0, 0, 'Azospirillum brasilense 1x10^8 CFU/ml', 'Mix 500ml per acre with irrigation water.'),
(4, 'Hybrid Paddy Seeds (CO-51) 10kg', 'வீரிய ஒட்டு நெல் விதை (CO-51) 10கிலோ', 'Seeds', 950.00, 1100.00, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 'High-yielding 110-day short duration paddy seed variety with pest resistance and high grain quality.', 'அதிக மகசூல் தரும் 110 நாள் குறுவை நெல் ரகம்.', 'High Yield Short Duration Paddy', 60, 4.90, 32, 1, 1, 'Germination Rate > 95%', '10kg per acre nursery bed sowing.'),
(5, 'Bio-Neem Oil Pest Guard 1L', 'இயற்கை வேப்ப எண்ணெய் பூச்சிகொல்லி 1லி', 'Pesticides', 380.00, 450.00, 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=600&q=80', 'Cold-pressed natural neem oil with 10000 PPM Azadirachtin. Controls sucking pests, caterpillars, and aphids effectively.', 'பூச்சிகளை கட்டுப்படுத்தும் இயற்கை வேப்ப எண்ணெய் சாறு.', '10000 PPM Cold Pressed Neem Extract', 90, 4.60, 11, 0, 0, 'Azadirachtin 10000 PPM', '5ml per liter of water with bio emulsifier.'),
(6, 'Humic Acid Growth Booster 500ml', 'ஹியூமிக் அமிலம் தாவர வளர்ச்சி ஊக்கி', 'Plant Growth Promoters', 340.00, 400.00, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', 'Concentrated liquid humic & fulvic acid that enhances root proliferation, nutrient uptake, and crop yields.', 'வேர் வளர்ச்சியை தூண்டும் ஹியூமிக் திரவம்.', '98% Potassium Humate Concentrate', 110, 4.80, 19, 1, 1, 'Humic Acid 12%, Fulvic Acid 3%', '2ml per liter water spray.'),
(7, '16L Battery Operated Knapsack Sprayer', '16 லிட்டர் பேட்டரி தெளிப்பான்', 'Farming Equipment', 2850.00, 3400.00, 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80', 'Heavy-duty 16L capacity battery powered agricultural sprayer with 12V 8Ah battery and dual brass nozzles.', '12V பேட்டரி கொண்ட 16லி விவசாய தெளிப்பான்.', 'Dual Brass Nozzle 12V 8Ah Battery', 25, 4.90, 42, 1, 1, 'High Pressure 110 PSI Pump', 'Charge for 4 hours for 6 hours continuous spray.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Offers
INSERT INTO offers (id, title, title_ta, code, discount_percentage, description, category, is_active) VALUES
(1, 'Farmer Welcome Offer', 'விவசாயி வரவேற்பு தள்ளுபடி', 'KISAAN15', 15, 'Get 15% flat discount on your first order of organic fertilizers and seeds.', 'Latest Discounts', 1),
(2, 'Monsoon Crop Special', 'பருவமழை சிறப்பு ஆஃபர்', 'MONSOON20', 20, 'Get 20% discount on NPK soluble fertilizers and Knapsack Sprayers.', 'Festival Offers', 1),
(3, 'Bulk Farm Combo Pack', 'மொத்த கொள்முதல் சலுகை', 'AGRIBULK25', 25, 'Save 25% on orders above ₹5000.', 'Combo Packages', 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 5. Sample Initial Order
INSERT INTO orders (id, custom_order_id, user_id, customer_name, customer_phone, customer_email, shipping_address, payment_method, payment_status, order_status, total_amount, razorpay_order_id, razorpay_payment_id, transaction_id)
VALUES (
  1, 
  'ORD-98412', 
  2, 
  'Ramanathan K.', 
  '9842111223', 
  'ramanathan@farm.in', 
  '{"fullName": "Ramanathan K.", "phone": "9842111223", "street": "Main Canal Bank Road, Plot 12", "city": "Cheranmahadevi", "state": "Tamil Nadu", "zipCode": "627414"}', 
  'UPI', 
  'Paid', 
  'Delivered', 
  1430.00, 
  'order_mock_9841201', 
  'pay_mock_8812738', 
  'TXN_AGRI_9841201'
) ON DUPLICATE KEY UPDATE custom_order_id=VALUES(custom_order_id);

INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity, image) VALUES
(1, 1, 1, 'NPK 19-19-19 Water Soluble Fertilizer 1kg', 450.00, 1, 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80'),
(2, 1, 4, 'Hybrid Paddy Seeds (CO-51) 10kg', 950.00, 1, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE product_name=VALUES(product_name);

INSERT INTO transactions (id, transaction_id, order_id, user_id, customer_name, customer_phone, customer_email, amount, payment_method, payment_gateway, gateway_order_id, gateway_payment_id, status, signature_verified) VALUES
(1, 'TXN_AGRI_9841201', 'ORD-98412', 2, 'Ramanathan K.', '9842111223', 'ramanathan@farm.in', 1430.00, 'Instant UPI', 'Razorpay', 'order_mock_9841201', 'pay_mock_8812738', 'Success', 1)
ON DUPLICATE KEY UPDATE transaction_id=VALUES(transaction_id);
