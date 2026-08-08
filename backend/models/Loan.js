const { getPool } = require('../config/db');

const memoryLoans = [
  {
    id: 'LN-1001',
    _id: 'LN-1001',
    name: 'Senthil Kumar M.',
    phone: '9842111223',
    aadhaar: '541234567890',
    loanType: 'Crop & Fertilizer Micro-Loan',
    amount: 45000,
    landSize: '3.5 Acres',
    location: 'Cheranmahadevi, Tirunelveli',
    bankAccount: '38921019281',
    ifsc: 'SBIN0001824',
    purpose: 'Need NPK fertilizers & paddy seeds for upcoming Samba crop season.',
    status: 'Pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'LN-1002',
    _id: 'LN-1002',
    name: 'Muthuraman P.',
    phone: '9443122334',
    aadhaar: '987654321012',
    loanType: 'Tractor & Machinery Loan',
    amount: 150000,
    landSize: '5.0 Acres',
    location: 'Ambasamudram',
    bankAccount: '91827364512',
    ifsc: 'IOBA0000412',
    purpose: 'Down payment subsidy for 16L Battery Sprayer and Mini Tiller.',
    status: 'Approved',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const mapRowToLoan = (l) => {
  if (!l) return null;
  return {
    _id: l.id || l._id,
    id: l.id || l._id,
    name: l.name,
    phone: l.phone,
    aadhaar: l.aadhaar || '',
    loanType: l.loan_type || l.loanType || 'Crop & Fertilizer Micro-Loan',
    amount: Number(l.amount || 0),
    landSize: l.land_size || l.landSize || '2 Acres',
    location: l.location || 'Cheranmahadevi',
    bankAccount: l.bank_account || l.bankAccount || '',
    ifsc: l.ifsc || '',
    purpose: l.purpose || '',
    status: l.status || 'Pending',
    createdAt: l.created_at || l.createdAt || new Date().toISOString()
  };
};

const Loan = {
  async find(filter = {}) {
    const pool = getPool();
    try {
      let sql = 'SELECT * FROM loans WHERE 1=1';
      const params = [];
      if (filter.status) {
        sql += ' AND status = ?';
        params.push(filter.status);
      }
      sql += ' ORDER BY created_at DESC';
      const [rows] = await pool.query(sql, params);
      if (rows && rows.length > 0) {
        return rows.map(mapRowToLoan);
      }
    } catch (e) {}

    let res = [...memoryLoans];
    if (filter.status) res = res.filter(l => l.status === filter.status);
    return res.map(mapRowToLoan);
  },

  async findById(id) {
    const all = await this.find();
    return all.find(l => l.id == id || l._id == id) || null;
  },

  async create(data) {
    const pool = getPool();
    const loanId = 'LN-' + Math.floor(10000 + Math.random() * 90000);

    try {
      await pool.query(
        `INSERT INTO loans (id, name, phone, aadhaar, loan_type, amount, land_size, location, bank_account, ifsc, purpose, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          loanId,
          data.name || 'Valued Farmer',
          data.phone || '',
          data.aadhaar || '',
          data.loanType || 'Crop Loan',
          data.amount || 0,
          data.landSize || '2 Acres',
          data.location || 'Cheranmahadevi',
          data.bankAccount || '',
          data.ifsc || '',
          data.purpose || '',
          data.status || 'Pending'
        ]
      );
    } catch (dbErr) {
      console.warn('MySQL Loan save notice (saved to memory store):', dbErr.message);
    }

    const loanObj = {
      id: loanId,
      _id: loanId,
      name: data.name || 'Valued Farmer',
      phone: data.phone || '',
      aadhaar: data.aadhaar || '',
      loanType: data.loanType || 'Crop Loan',
      amount: Number(data.amount || 0),
      landSize: data.landSize || '2 Acres',
      location: data.location || 'Cheranmahadevi',
      bankAccount: data.bankAccount || '',
      ifsc: data.ifsc || '',
      purpose: data.purpose || '',
      status: data.status || 'Pending',
      createdAt: new Date().toISOString()
    };

    memoryLoans.unshift(loanObj);
    return mapRowToLoan(loanObj);
  },

  async updateStatus(id, newStatus) {
    const pool = getPool();
    const memIdx = memoryLoans.findIndex(l => l.id == id || l._id == id);
    if (memIdx > -1) {
      memoryLoans[memIdx].status = newStatus;
    }

    try {
      await pool.query('UPDATE loans SET status = ? WHERE id = ?', [newStatus, id]);
    } catch (e) {}

    return this.findById(id);
  }
};

module.exports = Loan;
