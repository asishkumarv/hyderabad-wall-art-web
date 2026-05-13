const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const fs = require('fs');
const path = require('path');
const { query } = require('./config/db');

// Database initialization
const initDB = async () => {
  try {
    const schemaPath = path.join(__dirname, 'models', 'schema.sql');
    const migrationsPath = path.join(__dirname, 'models', 'migrations.sql');
    
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await query(schema);
      console.log('Database schema synchronized');
    }
    
    if (fs.existsSync(migrationsPath)) {
      const migrations = fs.readFileSync(migrationsPath, 'utf8');
      await query(migrations);
      console.log('Database migrations applied');
    }
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
};

initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
