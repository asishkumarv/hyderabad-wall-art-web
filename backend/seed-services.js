require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const services = [
  { 
    key: 'home', 
    label: 'Home Wall Art', 
    hero_title: 'Transform Your Home', 
    hero_subtitle: 'Elegant designs for every room', 
    why_choose_us: ['Premium paints', 'Fast delivery'], 
    is_active: true, 
    category: 'Home', 
    subcategory: 'Living Room', 
    description: 'Personalized wall art for your living space.', 
    images: [], 
    benefits: ['Enhanced aesthetics', 'Value for money'], 
    related_services: [] 
  },
  { 
    key: 'commercial', 
    label: 'Commercial Wall Art', 
    hero_title: 'Elevate Your Business', 
    hero_subtitle: 'Professional art for workspace', 
    why_choose_us: ['Durability', 'Branding focused'], 
    is_active: true, 
    category: 'Commercial', 
    subcategory: 'Office', 
    description: 'Art that inspires productivity and branding.', 
    images: [], 
    benefits: ['Brand recognition', 'Modern look'], 
    related_services: [] 
  },
  { 
    key: 'mural', 
    label: 'Mural Paintings', 
    hero_title: 'Hand-painted Murals', 
    hero_subtitle: 'Artistic expressions on your walls', 
    why_choose_us: ['Unique art', 'Custom themes'], 
    is_active: true, 
    category: 'Home', 
    subcategory: 'General', 
    description: 'Bespoke mural paintings for homes and offices.', 
    images: [], 
    benefits: ['Unique touch', 'Artistic value'], 
    related_services: [] 
  },
  { 
    key: 'stencil', 
    label: 'Stencil Wall Painting', 
    hero_title: 'Perfect Patterns', 
    hero_subtitle: 'Consistent and beautiful designs', 
    why_choose_us: ['Precision', 'Cost-effective'], 
    is_active: true, 
    category: 'Home', 
    subcategory: 'Pattern', 
    description: 'Modern stencil patterns for a stylish finish.', 
    images: [], 
    benefits: ['Symmetry', 'Variety of patterns'], 
    related_services: [] 
  }
];

async function seed() {
  for (const s of services) {
    try {
      await pool.query(
        `INSERT INTO services (key, label, hero_title, hero_subtitle, why_choose_us, is_active, category, subcategory, description, images, benefits, related_services) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
         ON CONFLICT (key) DO UPDATE SET 
           label = EXCLUDED.label,
           hero_title = EXCLUDED.hero_title,
           hero_subtitle = EXCLUDED.hero_subtitle,
           why_choose_us = EXCLUDED.why_choose_us,
           is_active = EXCLUDED.is_active,
           category = EXCLUDED.category,
           subcategory = EXCLUDED.subcategory,
           description = EXCLUDED.description,
           images = EXCLUDED.images,
           benefits = EXCLUDED.benefits,
           related_services = EXCLUDED.related_services`,
        [
          s.key, s.label, s.hero_title, s.hero_subtitle, 
          s.why_choose_us, s.is_active, 
          s.category, s.subcategory, s.description, 
          s.images, JSON.stringify(s.benefits), 
          JSON.stringify(s.related_services)
        ]
      );
      console.log(`Seeded/Updated service: ${s.key}`);
    } catch (err) {
      console.error(`Error seeding ${s.key}:`, err);
    }
  }
  pool.end();
}

seed();
