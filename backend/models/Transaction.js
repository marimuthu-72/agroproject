const { getPool } = require('../config/db');

const memoryTransactions = [];

const mapRowToTransaction = (t) => {
  if (!t) return null;
  return {
    _id: t.id || t._id,
    id: t.id || t._id,
    transactionId: t.transaction_id || t.transactionId,
    orderId: t.order_id || t.orderId,
    user: t.user_id || t.user,
    customerName: t.customer_name || t.customerName,
    customerPhone: t.customer_phone || t.customerPhone,
    customerEmail: t.customer_email || t.customerEmail || '',
    amount: Number(t.amount || 0),
    paymentMethod: t.payment_method || t.paymentMethod,
    paymentGateway: t.payment_gateway || t.paymentGateway,
    gatewayOrderId: t.gateway_order_id || t.gatewayOrderId || '',
    gatewayPaymentId: t.gateway_payment_id || t.gatewayPaymentId || '',
    gatewaySignature: t.gateway_signature || t.gatewaySignature || '',
    status: t.status || 'Pending',
    failureReason: t.failure_reason || t.failureReason || '',
    signatureVerified: Boolean(t.signature_verified || t.signatureVerified),
    createdAt: t.created_at || t.createdAt || new Date().toISOString()
  };
};

const Transaction = {
  async find(filter = {}) {
    const pool = getPool();
    try {
      let sql = 'SELECT * FROM transactions WHERE 1=1';
      const params = [];

      if (filter.status) {
        sql += ' AND status = ?';
        params.push(filter.status);
      }
      if (filter.paymentMethod) {
        sql += ' AND payment_method = ?';
        params.push(filter.paymentMethod);
      }

      sql += ' ORDER BY created_at DESC';
      const [rows] = await pool.query(sql, params);
      if (rows && rows.length > 0) {
        return rows.map(mapRowToTransaction);
      }
    } catch (e) {}

    let res = [...memoryTransactions];
    if (filter.status) res = res.filter(t => t.status === filter.status);
    if (filter.paymentMethod) res = res.filter(t => t.paymentMethod === filter.paymentMethod);
    return res.map(mapRowToTransaction);
  },

  async create(data) {
    const pool = getPool();
    let insertedId = Date.now();

    try {
      const [result] = await pool.query(
        `INSERT INTO transactions (transaction_id, order_id, user_id, customer_name, customer_phone, customer_email, amount, payment_method, payment_gateway, gateway_order_id, gateway_payment_id, gateway_signature, status, failure_reason, signature_verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.transactionId, data.orderId, data.user || null, data.customerName,
          data.customerPhone, data.customerEmail || '', data.amount,
          data.paymentMethod || 'Razorpay', data.paymentGateway || 'Razorpay',
          data.gatewayOrderId || '', data.gatewayPaymentId || '', data.gatewaySignature || '',
          data.status || 'Pending', data.failureReason || '', data.signatureVerified ? 1 : 0
        ]
      );
      if (result && result.insertId) insertedId = result.insertId;
    } catch (dbErr) {
      console.warn('MySQL Transaction save notice (saved to memory store):', dbErr.message);
    }

    const txnObj = {
      id: insertedId,
      _id: insertedId,
      transaction_id: data.transactionId,
      transactionId: data.transactionId,
      order_id: data.orderId,
      orderId: data.orderId,
      user_id: data.user || null,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      customer_email: data.customerEmail || '',
      amount: data.amount,
      payment_method: data.paymentMethod || 'Razorpay',
      payment_gateway: data.paymentGateway || 'Razorpay',
      gateway_order_id: data.gatewayOrderId || '',
      gateway_payment_id: data.gatewayPaymentId || '',
      gateway_signature: data.gatewaySignature || '',
      status: data.status || 'Pending',
      failure_reason: data.failureReason || '',
      signature_verified: data.signatureVerified ? 1 : 0,
      created_at: new Date().toISOString()
    };

    memoryTransactions.unshift(txnObj);
    return mapRowToTransaction(txnObj);
  },

  async countDocuments(filter = {}) {
    const pool = getPool();
    try {
      let sql = 'SELECT COUNT(*) AS count FROM transactions WHERE 1=1';
      const params = [];
      if (filter.status) {
        sql += ' AND status = ?';
        params.push(filter.status);
      }
      const [rows] = await pool.query(sql, params);
      if (rows && rows[0] && rows[0].count > 0) return rows[0].count;
    } catch (e) {}

    let res = [...memoryTransactions];
    if (filter.status) res = res.filter(t => t.status === filter.status);
    return res.length;
  }
};

module.exports = Transaction;
