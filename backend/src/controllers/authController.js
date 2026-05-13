const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
require('dotenv').config();

const transformUser = (user) => {
  if (!user) return null;
  const { account_status, ...rest } = user;
  return {
    ...rest,
    accountStatus: account_status
  };
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: transformUser(userWithoutPassword) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, phone, avatar, account_status, permissions, last_login FROM users WHERE id = $1', [req.user.id]);
    res.json(transformUser(result.rows[0]));
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  const updates = { ...req.body };
  // Sanitize updates
  delete updates.id;
  delete updates.password;
  delete updates.role;
  delete updates.created_at;
  delete updates.updated_at;
  
  // Map camelCase to snake_case for database
  if (updates.accountStatus) {
    updates.account_status = updates.accountStatus;
    delete updates.accountStatus;
  }

  const fields = Object.keys(updates);
  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  try {
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = [...fields.map(field => updates[field]), req.user.id];
    
    const result = await query(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING id, name, email, role, phone, avatar, account_status, permissions`,
      values
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(transformUser(result.rows[0]));
  } catch (err) {
    console.error('UpdateProfile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
