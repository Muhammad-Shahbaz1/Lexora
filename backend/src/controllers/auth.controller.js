const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  // Create user
  const user = await User.create({ name, email, password });

  // Generate JWT and set cookie
  const token = generateToken(user._id, res);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      totalAnalyses: user.totalAnalyses,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user (include password for comparison)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Generate JWT and set cookie
  const token = generateToken(user._id, res);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      totalAnalyses: user.totalAnalyses,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Request Password Reset Code
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide your registered email address');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error('No user found with this email address');
  }

  // Generate a secure 6-digit numeric verification code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Set token and expire in 15 minutes
  user.resetPasswordToken = resetCode;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  console.log(`🔐 Password Reset Code for ${user.email}: ${resetCode}`);

  res.status(200).json({
    success: true,
    message: 'Password reset code generated successfully',
    resetCode, // Sent in response for seamless in-app reset experience
  });
});

// @desc    Reset Password using Code
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  if (!email || !resetCode || !newPassword) {
    res.status(400);
    throw new Error('Please provide email, 6-digit reset code, and new password');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
    resetPasswordToken: resetCode.trim(),
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset code. Please request a new one.');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Generate new JWT
  const token = generateToken(user._id, res);

  res.status(200).json({
    success: true,
    message: 'Password has been reset successfully! Logging you in...',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      totalAnalyses: user.totalAnalyses,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('lexora_token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
};
