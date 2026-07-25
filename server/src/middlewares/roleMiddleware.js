const AppError = require('../utils/AppError');
const FarmProfile = require('../models/FarmProfile');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

const requireApprovedFarmer = async (req, res, next) => {
  if (req.user.role === 'admin') return next();

  if (req.user.role !== 'farmer') {
    return next(new AppError('Only farmers can access this resource.', 403));
  }

  const farmProfile = await FarmProfile.findOne({ user: req.user._id });
  if (!farmProfile) {
    return next(new AppError('Please complete your farm profile onboarding first.', 400));
  }

  if (farmProfile.verificationStatus !== 'approved') {
    return next(
      new AppError(
        `Your farm profile is currently '${farmProfile.verificationStatus}'. An Admin must approve your farm before you can post or manage produce.`,
        403
      )
    );
  }

  req.farmProfile = farmProfile;
  next();
};

module.exports = { authorize, requireApprovedFarmer };
