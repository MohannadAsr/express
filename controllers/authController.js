const User = require('../models/userModel');
const { use } = require('../routes/userRoutes');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const getaccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Signup Controller
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = getaccessToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token: token,
    user: newUser,
  });
});

// Login Controller
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1- check if password & email is exist
  if (!email || !password) {
    return next(new AppError('Please provide the email and password!!', 400));
  }

  // 2- check if user exist  & password is correct
  const user = await User.findOne({ email }).select('+password +blocked');
  if (!user || !(await user.checkPassword(password, user.password))) {
    // dont specific what is wrong if email or password to prevent data leak
    return next(new AppError('Incorrect password or Email', 401));
  }

  // 3- check if user is Blocked
  if (user.blocked) {
    return next(
      new AppError(
        'You have been Banned please talk to customer services for more informations',
        403
      )
    );
  }

  // 3- if  everythings correct send the jwt

  token = getaccessToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

// All Users List Controller
exports.getAllusers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    result: users?.length,
    data: {
      users,
    },
  });
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  // 1- Getting the token and check if it's exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(new AppError('Please Login to get access to this route', 401));

  // 2- Verify the token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3- check if user still exist

  const user = await User.findById(decoded.id).select('+blocked');
  if (!user || user.blocked) {
    return next(
      new AppError(
        'the user that belong to token is no longer exist or banned',
        401
      )
    );
  }

  // 4- check if user changed password after the token was issued
  if (user.changePasswordAfter(decoded.iat)) {
    return new AppError(
      'USER changed password recently please login again',
      401
    );
  }

  next();
});
