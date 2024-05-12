const express = require('express');
const {
  getAllReviews,
  createReview,
} = require('../controllers/reviewControllers');
const { protect, restrictAt } = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictAt('user'), createReview);

module.exports = router;
