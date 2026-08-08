const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });
const { initDB, getPool } = require('../config/db');

const runSeed = async () => {
  try {
    console.log('--- Starting MySQL Database Seeding Script ---');
    await initDB();
    const pool = getPool();

    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const seedPath = path.join(__dirname, '../sql/seed.sql');

    if (fs.existsSync(schemaPath)) {
      console.log('Applying schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('✓ Schema applied successfully.');
    }

    if (fs.existsSync(seedPath)) {
      console.log('Applying seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seedSql);
      console.log('✓ Seed data applied successfully.');
    }

    console.log('--- MySQL Seeding Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('× Seeding Error:', error.message);
    process.exit(1);
  }
};

runSeed();
