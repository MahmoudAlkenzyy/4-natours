const User = require('../models/userModel');
const catchAsync = require('./catchAsync');
const AppError = require('../utils/appError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
    return newObj;
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // cheack if user send password info in the request
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates. please use /updatePassword',
        400,
      ),
    );
  //filterd out the fields name that are not allowed to be updated
  const filterdObj = filterObj(req.bode, 'name', 'email');
  //update data
  const user = await User.findByIdAndUpdate(req.user._id, filterdObj, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
  });
});
exports.getUser = getOne(User);
exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route not yet define! please use /signup instead',
  });
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getAllUsers = getAll(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
