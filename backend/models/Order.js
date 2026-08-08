const { getPool } = require('../config/db');

// In-Memory store fallback when MySQL daemon is in standalone fallback mode
const memoryOrders = [];

const mapRowToOrder = async (o) => {
  if (!o) return null;
  const pool = getPool();
  let itemsRows = [];
  try {
    const [rows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
    itemsRows = rows || [];
  } catch (e) {
    itemsRows = o.items || [];
  }

  let shipping = { fullName: '', phone: '', street: '', city: '', state: 'Tamil Nadu', zipCode: '' };
  try {
    shipping = typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : (o.shipping_address || o.shippingAddress);
  } catch (err) {
    shipping = { fullName: o.customer_name || o.customerName, phone: o.customer_phone || o.customerPhone, street: 'Main Road', city: 'Cheranmahadevi', state: 'Tamil Nadu', zipCode: '627414' };
  }

  const rawItems = (itemsRows && itemsRows.length > 0) ? itemsRows : (o.items || []);

  return {
    _id: o.id || o._id,
    id: o.id || o._id,
    customOrderId: o.custom_order_id || o.customOrderId,
    user: o.user_id || o.user,
    customerName: o.customer_name || o.customerName,
    customerPhone: o.customer_phone || o.customerPhone,
    customerEmail: o.customer_email || o.customerEmail,
    shippingAddress: shipping,
    paymentMethod: o.payment_method || o.paymentMethod,
    paymentStatus: o.payment_status || o.paymentStatus,
    orderStatus: o.order_status || o.orderStatus,
    totalAmount: Number(o.total_amount !== undefined ? o.total_amount : (o.totalAmount !== undefined ? o.totalAmount : (o.total || 0))),
    discountAmount: Number(o.discount_amount !== undefined ? o.discount_amount : (o.discountAmount || 0)),
    shippingFee: Number(o.shipping_fee !== undefined ? o.shipping_fee : (o.shippingFee || 0)),
    razorpayOrderId: o.razorpay_order_id || o.razorpayOrderId || '',
    razorpayPaymentId: o.razorpay_payment_id || o.razorpayPaymentId || '',
    razorpaySignature: o.razorpay_signature || o.razorpaySignature || '',
    transactionId: o.transaction_id || o.transactionId || '',
    createdAt: o.created_at || o.createdAt || new Date().toISOString(),
    items: rawItems.map(i => ({
      product: i.product_id || i.product,
      name: i.product_name || i.name,
      price: Number(i.price || 0),
      quantity: i.quantity || 1,
      image: i.image || ''
    }))
  };
};

const Order = {
  async findOne(filter = {}) {
    const pool = getPool();
    try {
      let sql = 'SELECT * FROM orders WHERE 1=1';
      const params = [];

      if (filter.customOrderId) {
        sql += ' AND custom_order_id = ?';
        params.push(filter.customOrderId);
      }
      if (filter.id) {
        sql += ' AND id = ?';
        params.push(filter.id);
      }

      sql += ' LIMIT 1';
      const [rows] = await pool.query(sql, params);
      if (rows && rows.length > 0) {
        return await mapRowToOrder(rows[0]);
      }
    } catch (dbErr) {}

    // Fallback to memory store
    const found = memoryOrders.find(o => {
      if (filter.customOrderId && (o.customOrderId === filter.customOrderId || o.custom_order_id === filter.customOrderId)) return true;
      if (filter.id && (o.id == filter.id || o._id == filter.id)) return true;
      return false;
    });

    return found ? await mapRowToOrder(found) : null;
  },

  async findById(id) {
    return this.findOne({ id });
  },

  async find(filter = {}) {
    const pool = getPool();
    let dbOrders = [];
    try {
      let sql = 'SELECT * FROM orders WHERE 1=1';
      const params = [];

      if (filter.user) {
        sql += ' AND user_id = ?';
        params.push(filter.user);
      }

      if (filter.paymentStatus && filter.paymentStatus.$in) {
        const placeholders = filter.paymentStatus.$in.map(() => '?').join(',');
        sql += ` AND payment_status IN (${placeholders})`;
        params.push(...filter.paymentStatus.$in);
      }

      sql += ' ORDER BY created_at DESC';
      const [rows] = await pool.query(sql, params);
      if (rows && rows.length > 0) {
        dbOrders = await Promise.all(rows.map(mapRowToOrder));
      }
    } catch (e) {}

    if (dbOrders.length > 0) return dbOrders;

    // Combine memory orders
    let result = [...memoryOrders];
    if (filter.user) {
      result = result.filter(o => o.user == filter.user || o.user_id == filter.user);
    }
    if (filter.paymentStatus && filter.paymentStatus.$in) {
      result = result.filter(o => filter.paymentStatus.$in.includes(o.paymentStatus) || filter.paymentStatus.$in.includes(o.payment_status));
    }

    return Promise.all(result.map(mapRowToOrder));
  },

  async create(data) {
    const pool = getPool();
    const customOrderId = data.customOrderId || ('ORD-' + Math.floor(10000 + Math.random() * 90000));
    const userId = data.user || null;
    const shippingJson = JSON.stringify(data.shippingAddress || {});
    let insertedId = Date.now();

    try {
      const [result] = await pool.query(
        `INSERT INTO orders (custom_order_id, user_id, customer_name, customer_phone, customer_email, shipping_address, payment_method, payment_status, order_status, total_amount, discount_amount, shipping_fee, razorpay_order_id, razorpay_payment_id, razorpay_signature, transaction_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customOrderId, userId, data.customerName || (data.shippingAddress ? data.shippingAddress.fullName : 'Customer'),
          data.customerPhone || (data.shippingAddress ? data.shippingAddress.phone : ''),
          data.customerEmail || '', shippingJson, data.paymentMethod || 'Razorpay',
          data.paymentStatus || 'Pending', data.orderStatus || 'Pending',
          data.totalAmount || 0, data.discountAmount || 0, data.shippingFee || 0,
          data.razorpayOrderId || '', data.razorpayPaymentId || '', data.razorpaySignature || '', data.transactionId || ''
        ]
      );
      if (result && result.insertId) insertedId = result.insertId;

      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          await pool.query(
            `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [insertedId, item.product || null, item.name || 'Agro Item', item.price || 0, item.quantity || 1, item.image || '']
          );
        }
      }
    } catch (dbErr) {
      console.warn('MySQL Order save notice (saved to memory store):', dbErr.message);
    }

    const orderObj = {
      id: insertedId,
      _id: insertedId,
      customOrderId: customOrderId,
      custom_order_id: customOrderId,
      user_id: userId,
      customer_name: data.customerName || 'Valued Farmer',
      customer_phone: data.customerPhone || '',
      customer_email: data.customerEmail || '',
      shipping_address: data.shippingAddress || {},
      payment_method: data.paymentMethod || 'Razorpay',
      payment_status: data.paymentStatus || 'Pending',
      order_status: data.orderStatus || 'Pending',
      total_amount: data.totalAmount || 0,
      discount_amount: data.discountAmount || 0,
      shipping_fee: data.shippingFee || 0,
      razorpay_order_id: data.razorpayOrderId || '',
      razorpay_payment_id: data.razorpayPaymentId || '',
      razorpay_signature: data.razorpaySignature || '',
      transaction_id: data.transactionId || '',
      created_at: new Date().toISOString(),
      items: data.items || []
    };

    memoryOrders.unshift(orderObj);
    return mapRowToOrder(orderObj);
  },

  async countDocuments(filter = {}) {
    const pool = getPool();
    try {
      let sql = 'SELECT COUNT(*) AS count FROM orders';
      const [rows] = await pool.query(sql);
      if (rows && rows[0] && rows[0].count > 0) return rows[0].count;
    } catch (e) {}

    return memoryOrders.length;
  },

  async updateByCustomOrderId(customOrderId, data) {
    const pool = getPool();

    // Update in memory store
    const memIdx = memoryOrders.findIndex(o => o.customOrderId === customOrderId || o.custom_order_id === customOrderId);
    if (memIdx > -1) {
      if (data.paymentStatus !== undefined) memoryOrders[memIdx].payment_status = memoryOrders[memIdx].paymentStatus = data.paymentStatus;
      if (data.orderStatus !== undefined) memoryOrders[memIdx].order_status = memoryOrders[memIdx].orderStatus = data.orderStatus;
      if (data.razorpayOrderId !== undefined) memoryOrders[memIdx].razorpay_order_id = memoryOrders[memIdx].razorpayOrderId = data.razorpayOrderId;
      if (data.razorpayPaymentId !== undefined) memoryOrders[memIdx].razorpay_payment_id = memoryOrders[memIdx].razorpayPaymentId = data.razorpayPaymentId;
      if (data.razorpaySignature !== undefined) memoryOrders[memIdx].razorpay_signature = memoryOrders[memIdx].razorpaySignature = data.razorpaySignature;
      if (data.transactionId !== undefined) memoryOrders[memIdx].transaction_id = memoryOrders[memIdx].transactionId = data.transactionId;
    }

    try {
      const fields = [];
      const params = [];

      if (data.paymentStatus !== undefined) { fields.push('payment_status = ?'); params.push(data.paymentStatus); }
      if (data.orderStatus !== undefined) { fields.push('order_status = ?'); params.push(data.orderStatus); }
      if (data.razorpayOrderId !== undefined) { fields.push('razorpay_order_id = ?'); params.push(data.razorpayOrderId); }
      if (data.razorpayPaymentId !== undefined) { fields.push('razorpay_payment_id = ?'); params.push(data.razorpayPaymentId); }
      if (data.razorpaySignature !== undefined) { fields.push('razorpay_signature = ?'); params.push(data.razorpaySignature); }
      if (data.transactionId !== undefined) { fields.push('transaction_id = ?'); params.push(data.transactionId); }

      if (fields.length > 0) {
        params.push(customOrderId);
        await pool.query(`UPDATE orders SET ${fields.join(', ')} WHERE custom_order_id = ?`, params);
      }
    } catch (e) {}

    return this.findOne({ customOrderId });
  },

  async updateById(id, data) {
    return this.updateByCustomOrderId(id, data);
  }
};

module.exports = Order;
