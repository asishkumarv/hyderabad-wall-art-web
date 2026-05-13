const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const setup = async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, '../models/schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Schema created successfully');

    // Create default admin user
    const adminEmail = 'admin@hyderabadwallarts.com';
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    
    if (checkUser.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin', adminEmail, hashedPassword, 'Administrator']
      );
      console.log('Default admin user created');
    }

    // Initialize settings if empty
    const checkSettings = await pool.query('SELECT * FROM settings WHERE id = 1');
    if (checkSettings.rows.length === 0) {
      await pool.query('INSERT INTO settings (id, site_name) VALUES (1, $1)', ['Hyderabad Wall Arts']);
      console.log('Default settings initialized');
    }

    console.log('Database setup complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during database setup:', err);
    process.exit(1);
  }
};

setup();
