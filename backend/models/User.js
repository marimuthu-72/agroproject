const bcrypt = require('bcryptjs');
const { getPool } = require('../config/db');

const User = {
  async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (!rows || rows.length === 0) return null;
    const u = rows[0];
    return {
      _id: u.id,
      id: u.id,
      name: u.name,
      email: u.email,
      password: u.password,
      phone: u.phone,
      address: {
        street: u.street || '',
        city: u.city || '',
        state: u.state || '',
        zipCode: u.zip_code || ''
      },
      role: u.role,
      createdAt: u.created_at
    };
  },

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    if (!rows || rows.length === 0) return null;
    const u = rows[0];
    return {
      _id: u.id,
      id: u.id,
      name: u.name,
      email: u.email,
      password: u.password,
      phone: u.phone,
      address: {
        street: u.street || '',
        city: u.city || '',
        state: u.state || '',
        zipCode: u.zip_code || ''
      },
      role: u.role,
      createdAt: u.created_at
    };
  },

  async create({ name, email, password, phone, street, city, state, zipCode, role = 'user' }) {
    const pool = getPool();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, phone, street, city, state, zip_code, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, phone || '', street || '', city || '', state || '', zipCode || '', role]
    );

    return this.findById(result.insertId);
  },

  async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  async countDocuments(filter = {}) {
    const pool = getPool();
    let sql = 'SELECT COUNT(*) AS count FROM users';
    const params = [];

    if (filter.role) {
      sql += ' WHERE role = ?';
      params.push(filter.role);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].count;
  },

  async find(filter = {}) {
    const pool = getPool();
    let sql = 'SELECT id AS _id, id, name, email, phone, role, street, city, state, zip_code, created_at FROM users';
    const params = [];

    if (filter.role) {
      sql += ' WHERE role = ?';
      params.push(filter.role);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows.map(u => ({
      _id: u._id,
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      address: {
        street: u.street || '',
        city: u.city || '',
        state: u.state || '',
        zipCode: u.zip_code || ''
      },
      createdAt: u.created_at
    }));
  }
};

module.exports = User;
