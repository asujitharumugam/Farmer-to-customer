const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to access.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_farm_to_table_jwt_key_2026_production');

    let currentUser = await User.findById(decoded.id);
    if (!currentUser && decoded.userMock) {
      currentUser = decoded.userMock;
    }

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
});

module.exports = { protect };
