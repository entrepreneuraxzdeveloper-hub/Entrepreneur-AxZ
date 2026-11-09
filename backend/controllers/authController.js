const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'axz_secret_key_super_secure_roy_chowdhury_2026_jwt';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check existing
    const existingUser = db.findOne('users', (u) => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please login.',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role (default: user, allows admin assignment)
    const assignedRole = role === 'admin' ? 'admin' : 'user';

    const newUser = db.insert('users', {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: assignedRole,
    });

    const token = createToken(newUser);

    const { password: _, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while registering user.',
      error: err.message,
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findOne('users', (u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = createToken(user);
    const { password: _, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
      error: err.message,
    });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
      error: err.message,
    });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// GET /api/auth/users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = db.findAll('users').map((u) => {
      const { password, ...safe } = u;
      return safe;
    });
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users list.',
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  getAllUsers,
};

