const { getPool } = require('../config/db');

const mapRowToOffer = (o) => {
  if (!o) return null;
  return {
    _id: o.id,
    id: o.id,
    title: o.title,
    titleTa: o.title_ta || '',
    code: o.code,
    discountPercentage: o.discount_percentage,
    description: o.description || '',
    category: o.category || 'Latest Discounts',
    validUntil: o.valid_until,
    image: o.image || '',
    isActive: Boolean(o.is_active),
    createdAt: o.created_at
  };
};

const Offer = {
  async find(filter = {}) {
    const pool = getPool();
    let sql = 'SELECT * FROM offers WHERE 1=1';
    const params = [];

    if (filter.isActive !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filter.isActive ? 1 : 0);
    }

    if (filter.category) {
      sql += ' AND category = ?';
      params.push(filter.category);
    }

    sql += ' ORDER BY id ASC';
    const [rows] = await pool.query(sql, params);
    return rows.map(mapRowToOffer);
  },

  async create(data) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO offers (title, title_ta, code, discount_percentage, description, category, valid_until, image, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, data.titleTa || '', data.code, data.discountPercentage,
        data.description || '', data.category || 'Latest Discounts',
        data.validUntil || null, data.image || '', data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1
      ]
    );
    const [rows] = await pool.query('SELECT * FROM offers WHERE id = ? LIMIT 1', [result.insertId]);
    return mapRowToOffer(rows[0]);
  }
};

module.exports = Offer;
