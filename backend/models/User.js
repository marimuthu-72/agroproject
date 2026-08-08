const bcrypt = require('bcryptjs');
const { getPool } = require('../config/db');

// In-Memory fallback store when MySQL server is in standalone fallback mode
const memoryUsers = [
  {
    id: 1,
    _id: 1,
    name: 'Ramanathan K.',
    email: 'ramanathan@farm.in',
    phone: '9842111223',
    role: 'user',
    address: { street: 'Main Canal Bank Road', city: 'Cheranmahadevi', state: 'Tamil Nadu', zipCode: '627414' },
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    _id: 2,
    name: 'Murugan P.',
    email: 'murugan@agri.com',
    phone: '9789054321',
    role: 'user',
    address: { street: 'Green Field Street', city: 'Coimbatore', state: 'Tamil Nadu', zipCode: '641001' },
    createdAt: new Date().toISOString()
  }
];

const mapRowToUser = (u) => {
  if (!u) return null;
  return {
    _id: u.id || u._id,
    id: u.id || u._id,
    name: u.name,
    email: u.email,
    password: u.password || '',
    phone: u.phone || '',
    role: u.role || 'user',
    address: typeof u.address === 'object' ? u.address : {
      street: u.street || '',
      city: u.city || '',
      state: u.state || '',
      zipCode: u.zip_code || u.zipCode || ''
    },
    createdAt: u.created_at || u.createdAt || new Date().toISOString()
  };
};

const User = {
  async findByEmail(email) {
    const pool = getPool();
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      if (rows && rows.length > 0) return mapRowToUser(rows[0]);
    } catch (e) {}

    const found = memoryUsers.find(u => u.email && u.email.toLowerCase() === String(email).toLowerCase());
    return found ? mapRowToUser(found) : null;
  },

  async findById(id) {
    const pool = getPool();
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      if (rows && rows.length > 0) return mapRowToUser(rows[0]);
    } catch (e) {}

    const found = memoryUsers.find(u => u.id == id || u._id == id);
    return found ? mapRowToUser(found) : null;
  },

  async create({ name, email, password, phone, street, city, state, zipCode, role = 'user' }) {
    const pool = getPool();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || '123456', salt);
    let insertedId = Date.now();

    try {
      const [result] = await pool.query(
        `INSERT INTO users (name, email, password, phone, street, city, state, zip_code, role) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, phone || '', street || '', city || '', state || '', zipCode || '', role]
      );
      if (result && result.insertId) insertedId = result.insertId;
    } catch (dbErr) {
      console.warn('MySQL User save notice (saved to memory store):', dbErr.message);
    }

    const userObj = {
      id: insertedId,
      _id: insertedId,
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: role || 'user',
      street: street || '',
      city: city || '',
      state: state || '',
      zip_code: zipCode || '',
      address: { street: street || '', city: city || '', state: state || '', zipCode: zipCode || '' },
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    memoryUsers.unshift(userObj);
    return mapRowToUser(userObj);
  },

  async matchPassword(enteredPassword, hashedPassword) {
    if (!hashedPassword) return false;
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  async countDocuments(filter = {}) {
    const pool = getPool();
    try {
      let sql = 'SELECT COUNT(*) AS count FROM users';
      const params = [];
      if (filter.role) {
        sql += ' WHERE role = ?';
        params.push(filter.role);
      }
      const [rows] = await pool.query(sql, params);
      if (rows && rows[0] && rows[0].count > 0) return rows[0].count;
    } catch (e) {}

    let res = [...memoryUsers];
    if (filter.role) res = res.filter(u => u.role === filter.role);
    return res.length;
  },

  async find(filter = {}) {
    const pool = getPool();
    try {
      let sql = 'SELECT id AS _id, id, name, email, phone, role, street, city, state, zip_code, created_at FROM users';
      const params = [];

      if (filter.role) {
        sql += ' WHERE role = ?';
        params.push(filter.role);
      }

      sql += ' ORDER BY created_at DESC';

      const [rows] = await pool.query(sql, params);
      if (rows && rows.length > 0) {
        return rows.map(mapRowToUser);
      }
    } catch (e) {}

    let res = [...memoryUsers];
    if (filter.role) res = res.filter(u => u.role === filter.role);
    return res.map(mapRowToUser);
  }
};

module.exports = User;
