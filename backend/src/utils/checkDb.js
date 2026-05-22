require('dotenv').config();
const { pool } = require('../config/db');

async function check() {
  try {
    const res = await pool.query("SELECT * FROM gallery");
    console.log("Gallery rows count:", res.rows.length);
    console.log("Gallery rows sample:", res.rows.slice(0, 3));
    
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'gallery'
    `);
    console.log("Gallery Columns:", columns.rows);
  } catch (err) {
    console.error("Error inspecting gallery table:", err);
  } finally {
    pool.end();
  }
}

check();
