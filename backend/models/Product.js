const { getPool } = require('../config/db');

const mapRowToProduct = (p) => {
  if (!p) return null;
  return {
    _id: p.id,
    id: p.id,
    name: p.name,
    nameTa: p.name_ta || '',
    category: p.category,
    price: Number(p.price),
    originalPrice: Number(p.original_price || 0),
    image: p.image,
    description: p.description,
    descriptionTa: p.description_ta || '',
    shortDescription: p.short_description || '',
    stock: p.stock,
    rating: Number(p.rating || 4.8),
    reviewsCount: p.reviews_count || 0,
    isFeatured: Boolean(p.is_featured),
    isBestSeller: Boolean(p.is_bestseller),
    composition: p.composition || '',
    usageGuide: p.usage_guide || '',
    createdAt: p.created_at
  };
};

const Product = {
  async find(query = {}) {
    const pool = getPool();
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (query.category && query.category !== 'All') {
      sql += ' AND category = ?';
      params.push(query.category);
    }

    if (query.search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR name_ta LIKE ?)';
      const searchPattern = `%${query.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (query.isFeatured) {
      sql += ' AND is_featured = 1';
    }

    if (query.isBestSeller) {
      sql += ' AND is_bestseller = 1';
    }

    if (query.sort === 'price-low') sql += ' ORDER BY price ASC';
    else if (query.sort === 'price-high') sql += ' ORDER BY price DESC';
    else if (query.sort === 'rating') sql += ' ORDER BY rating DESC';
    else sql += ' ORDER BY id ASC';

    const [rows] = await pool.query(sql, params);
    return rows.map(mapRowToProduct);
  },

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
    if (!rows || rows.length === 0) return null;
    return mapRowToProduct(rows[0]);
  },

  async create(data) {
    const pool = getPool();
    const {
      name, nameTa = '', category, price, originalPrice = 0, image,
      description, descriptionTa = '', shortDescription = '', stock = 100,
      rating = 4.8, reviewsCount = 12, isFeatured = false, isBestSeller = false,
      composition = 'N-P-K Formula', usageGuide = 'Use 5kg per acre'
    } = data;

    const [result] = await pool.query(
      `INSERT INTO products (name, name_ta, category, price, original_price, image, description, description_ta, short_description, stock, rating, reviews_count, is_featured, is_bestseller, composition, usage_guide)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, nameTa, category, price, originalPrice, image, description, descriptionTa, shortDescription, stock, rating, reviewsCount, isFeatured ? 1 : 0, isBestSeller ? 1 : 0, composition, usageGuide]
    );

    return this.findById(result.insertId);
  },

  async findByIdAndUpdate(id, data) {
    const pool = getPool();
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = { ...existing, ...data };

    await pool.query(
      `UPDATE products 
       SET name=?, name_ta=?, category=?, price=?, original_price=?, image=?, description=?, description_ta=?, short_description=?, stock=?, rating=?, reviews_count=?, is_featured=?, is_bestseller=?, composition=?, usage_guide=?
       WHERE id=?`,
      [
        updated.name, updated.nameTa, updated.category, updated.price, updated.originalPrice,
        updated.image, updated.description, updated.descriptionTa, updated.shortDescription,
        updated.stock, updated.rating, updated.reviewsCount, updated.isFeatured ? 1 : 0,
        updated.isBestSeller ? 1 : 0, updated.composition, updated.usageGuide, id
      ]
    );

    return this.findById(id);
  },

  async findByIdAndDelete(id) {
    const pool = getPool();
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return true;
  },

  async countDocuments(filter = {}) {
    const pool = getPool();
    let sql = 'SELECT COUNT(*) AS count FROM products';
    const params = [];
    if (filter.stock && filter.stock.$lt) {
      sql += ' WHERE stock < ?';
      params.push(filter.stock.$lt);
    }
    const [rows] = await pool.query(sql, params);
    return rows[0].count;
  }
};

module.exports = Product;
