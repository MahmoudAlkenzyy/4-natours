const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
  getReview,
} = require('../controllers/reviewControllers');
const { protect, restrictAt } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictAt('user'), setTourUserId, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictAt('user', 'admin'), updateReview)
  .delete(restrictAt('user', 'admin'), deleteReview);

module.exports = router;
