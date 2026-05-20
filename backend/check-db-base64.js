const { Client } = require('pg');
const path = require('path');
require('dotenv').config();

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set in environment variables!');
    process.exit(1);
  }
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Neon database successfully.');

    const tables = [
      { name: 'users', columns: ['avatar'] },
      { name: 'services', columns: ['images'] },
      { name: 'gallery', columns: ['image_url'] },
      { name: 'blogs', columns: ['image', 'gallery_images'] },
      { name: 'categories', columns: ['image'] },
      { name: 'videos', columns: ['thumbnail', 'video_url'] },
      { name: 'testimonials', columns: ['image'] },
      { name: 'settings', columns: ['logo'] }
    ];

    for (const table of tables) {
      console.log(`Checking table: ${table.name}...`);
      const res = await client.query(`SELECT * FROM ${table.name}`);
      let totalRows = res.rows.length;
      let base64Count = 0;

      for (const row of res.rows) {
        let hasBase64 = false;
        for (const col of table.columns) {
          const val = row[col];
          if (!val) continue;

          if (Array.isArray(val)) {
            for (const item of val) {
              if (item && item.startsWith('data:')) {
                hasBase64 = true;
              }
            }
          } else if (typeof val === 'string' && val.startsWith('data:')) {
            hasBase64 = true;
          }
        }
        if (hasBase64) {
          base64Count++;
        }
      }
      console.log(`Table ${table.name}: ${base64Count} of ${totalRows} rows contain base64 media.`);
    }

  } catch (err) {
    console.error('Error connecting or querying database:', err);
  } finally {
    await client.end();
  }
}

run();
