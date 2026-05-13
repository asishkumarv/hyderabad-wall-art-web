require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function checkSchema() {
  try {
    const tables = ['services', 'pages', 'settings'];
    for (const table of tables) {
      console.log(`--- Schema for ${table} ---`);
      const res = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}'`);
      console.log(JSON.stringify(res.rows, null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkSchema();
