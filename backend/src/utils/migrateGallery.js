require('dotenv').config();
const { pool } = require('../config/db');

async function migrate() {
  try {
    console.log("Starting gallery schema migration...");
    
    // Begin transaction
    await pool.query("BEGIN");
    
    // Drop existing gallery table if any (cascading)
    await pool.query("DROP TABLE IF EXISTS gallery CASCADE");
    console.log("Dropped old gallery table if existed");

    // Create gallery_sections table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery_sections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created gallery_sections table");

    // Create new gallery table referencing gallery_sections
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        section_id UUID REFERENCES gallery_sections(id) ON DELETE CASCADE,
        title TEXT,
        alt_text TEXT,
        image_url TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created new gallery table");

    await pool.query("COMMIT");
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
