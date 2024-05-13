const express = require('express');
const {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictAt,
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgetPassword').post(forgetPassword);
router.route('/resetPassword/:token').patch(resetPassword);

router.use(protect);

router.route('/me').get(getMe, getUser);
router.route('/updatePassword').patch(updatePassword);
router.route('/updateMe').patch(updateMe);
router.route('/deleteMe').delete(deleteMe);

router.use(restrictAt('admin'));

router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
