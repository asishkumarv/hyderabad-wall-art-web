const { query } = require('../config/db');

// Generic CRUD factory
const getAll = (table) => async (req, res) => {
  try {
    const result = await query(`SELECT * FROM ${table} ORDER BY ${table === 'activities' || table === 'leads' || table === 'blogs' || table === 'gallery' || table === 'contacts' ? 'created_at DESC' : 'id ASC'}`);
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching ${table}:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
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
    console.error(`Error creating ${table}:`, err);
    const status = err.code === '23505' ? 409 : 500;
    res.status(status).json({ message: err.message });
  }
};

const update = (table, idField = 'id') => async (req, res) => {
  const id = req.params.id || req.params.key;
  const updates = { ...req.body };
  delete updates.id;
  delete updates.created_at;
  delete updates.updated_at;
  
  const fields = Object.keys(updates);
  
  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  try {
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = [...fields.map(field => updates[field]), id];
    
    const result = await query(
      `UPDATE ${table} SET ${setClause}, updated_at = NOW() WHERE ${idField} = $${fields.length + 1} RETURNING *`,
      values
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating ${table}:`, err);
    const status = err.code === '23505' ? 409 : 500;
    res.status(status).json({ message: err.message });
  }
};

const remove = (table, idField = 'id') => async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query(`DELETE FROM ${table} WHERE ${idField} = $1`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(`Error deleting ${table}:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
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
  const updates = req.body;
  const fields = Object.keys(updates);
  
  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  try {
    // Check if service exists first to decide between INSERT or UPDATE, or just use UPSERT syntax
    // We'll use UPSERT with default values for required fields if they aren't provided
    const columns = ['key', ...fields];
    const values = [key, ...fields.map(f => {
      if ((f === 'benefits' || f === 'related_services') && typeof updates[f] === 'object') {
        return JSON.stringify(updates[f]);
      }
      return updates[f];
    })];
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const updateClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');

    const result = await query(
      `INSERT INTO services (${columns.join(', ')}, updated_at) 
       VALUES (${placeholders}, NOW()) 
       ON CONFLICT (key) DO UPDATE SET ${updateClause}, updated_at = NOW() 
       RETURNING *`,
      values
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
      [page_name, typeof content === 'object' ? JSON.stringify(content) : content]
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
  const updates = req.body;
  const fields = Object.keys(updates);
  
  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  try {
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = fields.map(field => {
      const val = updates[field];
      if (field === 'social' && typeof val === 'object') {
        return JSON.stringify(val);
      }
      return val;
    });
    
    const result = await query(
      `UPDATE settings SET ${setClause}, updated_at = NOW() WHERE id = 1 RETURNING *`,
      values
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
exports.updateGallery = update('gallery');
exports.deleteGallery = remove('gallery');

exports.getLeads = getAll('leads');
exports.createLead = create('leads', ['name', 'phone', 'inquiry', 'source', 'location_tag', 'suggested_location', 'status']);
exports.updateLead = update('leads');
exports.deleteLead = remove('leads');

exports.getBlogs = getAll('blogs');
exports.createBlog = create('blogs', ['title', 'slug', 'category', 'excerpt', 'content', 'image']);
exports.updateBlog = update('blogs');
exports.deleteBlog = remove('blogs');

exports.getCategories = getAll('categories');
exports.createCategory = create('categories', ['name', 'image', 'description']);
exports.updateCategory = update('categories');
exports.deleteCategory = remove('categories');

exports.getVideos = getAll('videos');
exports.createVideo = create('videos', ['title', 'thumbnail', 'video_url', 'category']);
exports.updateVideo = update('videos');
exports.deleteVideo = remove('videos');

exports.getTestimonials = getAll('testimonials');
exports.createTestimonial = create('testimonials', ['name', 'initials', 'rating', 'message', 'image']);
exports.updateTestimonial = update('testimonials');
exports.deleteTestimonial = remove('testimonials');

exports.getActivities = getAll('activities');
exports.createActivity = create('activities', ['message']);

exports.getContacts = getAll('contacts');
exports.createContact = create('contacts', ['name', 'phone', 'message']);
exports.deleteContact = remove('contacts');
