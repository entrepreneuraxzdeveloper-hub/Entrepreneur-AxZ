const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'axz_secret_key_super_secure_roy_chowdhury_2026_jwt';

const authenticateToken = (req, res, next) => {
  let token = null;
  const authHeader = req.headers['authorization'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.findById('users', decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: User no longer exists.',
      });
    }

    // Do not leak password hash in req.user
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid, malformed, or expired token.',
      error: err.message,
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Administrator privileges required for this operation.',
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
};

