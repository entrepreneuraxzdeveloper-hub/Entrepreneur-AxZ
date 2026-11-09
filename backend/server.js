const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const companyRoutes = require('./routes/companyRoutes');
const pricingRoutes = require('./routes/pricingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded media
app.use('/uploads', express.static(UPLOADS_DIR));

// Serve Admin Panel Static Assets
const PUBLIC_DIR = path.join(__dirname, 'public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
app.use(express.static(PUBLIC_DIR));

// Fallback to serve frontend public assets when running in unified environment
const FRONTEND_PUBLIC_DIR = path.join(__dirname, '..', 'frontend', 'public');
if (fs.existsSync(FRONTEND_PUBLIC_DIR)) {
  app.use(express.static(FRONTEND_PUBLIC_DIR));
}

// API Health Check
app.get('/api/health', (req, res) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    (process.env.NODE_ENV === 'production'
      ? `${req.protocol}://${req.get('host').replace(/^api\./, '')}`
      : 'http://localhost:3000');

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    frontendUrl,
    stats: {
      users: db.findAll('users').length,
      products: db.findAll('products').length,
      services: db.findAll('services').length,
      inquiries: db.findAll('inquiries').length,
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/pricing-table', pricingRoutes);

// Admin Web Application Fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint '${req.path}' not found.`,
    });
  }
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(200).send(`
    <html>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2>AxZ Backend Server is Running!</h2>
        <p>API is active on port ${PORT}.</p>
      </body>
    </html>
  `);
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `Upload Error: ${err.message}`,
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start Server
const startServer = async () => {
  try {
    await db.init();
    app.listen(PORT, () => {
      const publicUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      console.log(`=================================================`);
      console.log(` AxZ Enterprise Backend & Admin Server running!`);
      console.log(` Live Public Website: ${publicUrl} (User-Facing)`);
      console.log(` Admin Portal:        http://localhost:${PORT} / http://localhost:3000/admin`);
      console.log(` API Base:            http://localhost:${PORT}/api`);
      console.log(` Uploads:             http://localhost:${PORT}/uploads`);
      console.log(` Environment:         ${process.env.NODE_ENV || 'development'}`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('Fatal initialization error:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;

