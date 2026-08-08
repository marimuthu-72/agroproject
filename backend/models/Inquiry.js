const { getPool } = require('../config/db');

const memoryInquiries = [
  {
    id: 1,
    _id: 1,
    name: 'Muthukumar S.',
    phone: '9842111223',
    email: 'muthu@farm.in',
    subject: 'Soil Testing Appointment',
    message: 'Need soil sample testing for Paddy field in Cheranmahadevi.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    _id: 2,
    name: 'Karthik Raja',
    phone: '9443122334',
    email: 'karthik@agri.com',
    subject: 'Bulk Fertilizer Order',
    message: 'Required 50 bags of NPK 19-19-19 for upcoming season.',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const mapRowToInquiry = (i) => {
  if (!i) return null;
  return {
    _id: i.id || i._id,
    id: i.id || i._id,
    name: i.name,
    phone: i.phone,
    email: i.email || '',
    subject: i.subject || 'General Support',
    message: i.message || '',
    status: i.status || 'New',
    createdAt: i.created_at || i.createdAt || new Date().toISOString()
  };
};

const Inquiry = {
  async find(filter = {}) {
    const pool = getPool();
    try {
      let sql = 'SELECT * FROM inquiries WHERE 1=1';
      const params = [];
      if (filter.status) {
        sql += ' AND status = ?';
        params.push(filter.status);
      }
      sql += ' ORDER BY created_at DESC';
      const [rows] = await pool.query(sql, params);
      if (rows && rows.length > 0) {
        return rows.map(mapRowToInquiry);
      }
    } catch (e) {}

    let res = [...memoryInquiries];
    if (filter.status) res = res.filter(i => i.status === filter.status);
    return res.map(mapRowToInquiry);
  },

  async findById(id) {
    const all = await this.find();
    return all.find(i => i.id == id || i._id == id) || null;
  },

  async create(data) {
    const pool = getPool();
    let insertedId = Date.now();

    try {
      const [result] = await pool.query(
        `INSERT INTO inquiries (name, phone, email, subject, message, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.name || 'Valued Farmer',
          data.phone || '',
          data.email || '',
          data.subject || 'General Support',
          data.message || '',
          data.status || 'New'
        ]
      );
      if (result && result.insertId) insertedId = result.insertId;
    } catch (dbErr) {
      console.warn('MySQL Inquiry save notice (saved to memory store):', dbErr.message);
    }

    const inqObj = {
      id: insertedId,
      _id: insertedId,
      name: data.name || 'Valued Farmer',
      phone: data.phone || '',
      email: data.email || '',
      subject: data.subject || 'General Support',
      message: data.message || '',
      status: data.status || 'New',
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    memoryInquiries.unshift(inqObj);
    return mapRowToInquiry(inqObj);
  },

  async updateStatus(id, newStatus) {
    const pool = getPool();
    const memIdx = memoryInquiries.findIndex(i => i.id == id || i._id == id);
    if (memIdx > -1) {
      memoryInquiries[memIdx].status = newStatus;
    }

    try {
      await pool.query('UPDATE inquiries SET status = ? WHERE id = ?', [newStatus, id]);
    } catch (e) {}

    return this.findById(id);
  },

  async countDocuments(filter = {}) {
    const pool = getPool();
    try {
      let sql = 'SELECT COUNT(*) AS count FROM inquiries WHERE 1=1';
      const params = [];
      if (filter.status) {
        sql += ' AND status = ?';
        params.push(filter.status);
      }
      const [rows] = await pool.query(sql, params);
      if (rows && rows[0] && rows[0].count > 0) return rows[0].count;
    } catch (e) {}

    let res = [...memoryInquiries];
    if (filter.status) res = res.filter(i => i.status === filter.status);
    return res.length;
  }
};

module.exports = Inquiry;
