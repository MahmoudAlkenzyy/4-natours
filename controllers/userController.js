const User = require('../models/userModel');
const catchAsync = require('./catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    users,
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route not yet define ',
  });
};
exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route not yet define ',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route not yet define ',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route not yet define ',
  });
};
