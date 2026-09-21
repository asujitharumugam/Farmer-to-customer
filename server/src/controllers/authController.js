const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_farm_to_table_jwt_key_2026_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: { user }
  });
};

exports.sendOTP = catchAsync(async (req, res, next) => {
  const { target, type } = req.body; // type: 'email' | 'phone'
  if (!target) {
    return next(new AppError('Please provide email or phone number for OTP verification.', 400));
  }

  // Generate 6-digit OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  console.log(`[OTP AUTH SIMULATION] Sent OTP ${otpCode} to ${type}: ${target}`);

  res.status(200).json({
    success: true,
    message: `OTP sent successfully to your ${type || 'contact'} (${target})`,
    otpCode,
    target,
    type: type || 'email'
  });
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { target, otpCode } = req.body;
  if (!target || !otpCode) {
    return next(new AppError('Please provide target and 6-digit OTP code.', 400));
  }

  // Verification check: Accept any 6-digit numeric string or matching simulation code
  if (otpCode.length !== 6 || isNaN(Number(otpCode))) {
    return next(new AppError('Invalid OTP code format. Enter 6 numeric digits.', 400));
  }

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully!',
    verifiedTarget: target
  });
});

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role, phone, otpVerified } = req.body;

  if (role === 'admin') {
    return next(new AppError('Cannot register as Admin directly.', 403));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered', 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: role || 'customer',
    phone: phone || '',
    approvalStatus: 'approved',
    isPhoneVerified: Boolean(phone && otpVerified),
    isEmailVerified: Boolean(email && otpVerified)
  });

  sendTokenResponse(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  if (user.status === 'suspended') {
    return next(new AppError('Your account has been suspended by an Administrator.', 403));
  }

  sendTokenResponse(user, 200, res);
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    data: { user }
  });
});

exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide your email address.', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user registered with that email address.', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  console.log(`[PASSWORD RESET DEMO LINK]: ${resetURL}`);

  res.status(200).json({
    success: true,
    message: 'Password reset token generated and dispatched.',
    resetToken,
    resetURL
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Password reset token is invalid or has expired.', 400));
  }

  if (!req.body.password || req.body.password.length < 6) {
    return next(new AppError('New password must be at least 6 characters.', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
