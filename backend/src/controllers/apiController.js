const { query } = require('../config/db');

// Generic CRUD factory
const getAll = (table) => async (req, res) => {
  try {
    const result = await query(`SELECT * FROM ${table} ORDER BY ${table === 'activities' || table === 'leads' || table === 'blogs' || table === 'gallery' ? 'created_at DESC' : 'id ASC'}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const create = (table, fields) => async (req, res) => {
  try {
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    const columns = fields.join(', ');
    const values = fields.map(field => req.body[field]);
    
    const result = await query(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const update = (table, fields, idField = 'id') => async (req, res) => {
  const id = req.params.id;
  try {
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = [...fields.map(field => req.body[field]), id];
    
    const result = await query(
      `UPDATE ${table} SET ${setClause}, updated_at = NOW() WHERE ${idField} = $${fields.length + 1} RETURNING *`,
      values
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = (table, idField = 'id') => async (req, res) => {
  const id = req.params.id;
  try {
    await query(`DELETE FROM ${table} WHERE ${idField} = $1`, [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Specialized controllers
exports.getServices = async (req, res) => {
  try {
    const result = await query('SELECT * FROM services ORDER BY key');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  const { key } = req.params;
  const { label, hero_title, hero_subtitle, why_choose_us, is_active, category, subcategory, description, images } = req.body;
  try {
    const result = await query(
      `UPDATE services SET label = $1, hero_title = $2, hero_subtitle = $3, why_choose_us = $4, is_active = $5, category = $6, subcategory = $7, description = $8, images = $9, updated_at = NOW() WHERE key = $10 RETURNING *`,
      [label, hero_title, hero_subtitle, why_choose_us, is_active, category, subcategory, description, images, key]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPages = async (req, res) => {
  try {
    const result = await query('SELECT * FROM pages');
    const pages = result.rows.reduce((acc, row) => {
      acc[row.page_name] = row.content;
      return acc;
    }, {});
    res.json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePage = async (req, res) => {
  const { page_name } = req.params;
  const { content } = req.body;
  try {
    const result = await query(
      'INSERT INTO pages (page_name, content) VALUES ($1, $2) ON CONFLICT (page_name) DO UPDATE SET content = $2, updated_at = NOW() RETURNING *',
      [page_name, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const result = await query('SELECT * FROM settings WHERE id = 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  const { site_name, logo, social, footer, whatsapp_number, instagram_url, office_address } = req.body;
  try {
    const result = await query(
      `UPDATE settings SET site_name = $1, logo = $2, social = $3, footer = $4, whatsapp_number = $5, instagram_url = $6, office_address = $7, updated_at = NOW() WHERE id = 1 RETURNING *`,
      [site_name, logo, social, footer, whatsapp_number, instagram_url, office_address]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Expose generic CRUDs
exports.getGallery = getAll('gallery');
exports.createGallery = create('gallery', ['title', 'category', 'alt_text', 'image_url']);
exports.updateGallery = update('gallery', ['title', 'category', 'alt_text', 'image_url']);
exports.deleteGallery = remove('gallery');

exports.getLeads = getAll('leads');
exports.createLead = create('leads', ['name', 'phone', 'inquiry', 'source', 'location_tag', 'suggested_location', 'status']);
exports.updateLead = update('leads', ['name', 'phone', 'inquiry', 'source', 'location_tag', 'suggested_location', 'status', 'last_status_change_at']);
exports.deleteLead = remove('leads');

exports.getBlogs = getAll('blogs');
exports.createBlog = create('blogs', ['title', 'slug', 'category', 'excerpt', 'content', 'image']);
exports.updateBlog = update('blogs', ['title', 'slug', 'category', 'excerpt', 'content', 'image']);
exports.deleteBlog = remove('blogs');

exports.getCategories = getAll('categories');
exports.createCategory = create('categories', ['name', 'image', 'description']);
exports.updateCategory = update('categories', ['name', 'image', 'description']);
exports.deleteCategory = remove('categories');

exports.getVideos = getAll('videos');
exports.createVideo = create('videos', ['title', 'thumbnail', 'video_url', 'category']);
exports.updateVideo = update('videos', ['title', 'thumbnail', 'video_url', 'category']);
exports.deleteVideo = remove('videos');

exports.getTestimonials = getAll('testimonials');
exports.createTestimonial = create('testimonials', ['name', 'initials', 'rating', 'message', 'image']);
exports.updateTestimonial = update('testimonials', ['name', 'initials', 'rating', 'message', 'image']);
exports.deleteTestimonial = remove('testimonials');

exports.getActivities = getAll('activities');
exports.createActivity = create('activities', ['message']);

exports.getContacts = getAll('contacts');
exports.createContact = create('contacts', ['name', 'phone', 'message']);
exports.deleteContact = remove('contacts');
