const Review = require('../models/reviewModel');
const catchAsync = require('./catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create({
    review: req.body.review,
    reting: req.body.reting,
    tour: req.body.tour,
    user: req.body.user,
  });
  res.status(201).json({
    status: 'success',
    review,
  });
});
