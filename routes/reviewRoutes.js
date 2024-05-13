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

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictAt('user'), setTourUserId, createReview);

router.route('/:id').get(getReview).patch(updateReview).delete(deleteReview);

module.exports = router;
