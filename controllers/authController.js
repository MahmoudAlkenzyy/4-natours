const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('./catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check is email and password exist
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }

  //check if user existing & password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password ', 401));
  }

  //if everything ok then send the token to the client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    // console.log(authorization.split(' ')[1]);
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! please log in to get access', 401),
    );
  }
  // verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //cheack if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belong to this token doas no longer exist.', 401),
    );
  }
  //Cheack the password not changed
  if (freshUser.ChangedPasswordAfter(decoded.iat)) {
    next(
      new AppError(
        'User recently change the password! please login again',
        401,
      ),
    );
  }

  req.user = freshUser;
  next();
});
exports.restrictAt = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  //Get user based on posted email
  if (!user) {
    return next(new AppError('There is no user with that email address'));
  }
  //generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //send it to user's email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forget your password? submit a patch request with your new password and confirm password to: ${resetUrl}.\n if you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email successfully',
    });
  } catch (error) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(error.message, 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //if token has not expired and there is user , set a new password

  if (!user) {
    next(new AppError('invalid token or expired', 400));
  }
  // set a new password

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  //save a new document
  await user.save();
  //log in and send jwt to the user
  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});
