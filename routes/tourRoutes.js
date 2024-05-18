const express = require('express');
const reviewRouter = require('./reviewRoutes');
const {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  aliesTopTours,
  getTourStats,
  getMonthlyPlan,
  getTourWithin,
  getDistances,
} = require('../controllers/tourController');
const { protect, restrictAt } = require('../controllers/authController');

const router = express.Router();
// router.param('id', checkID);

router.use('/:tourId/reviews', reviewRouter);

router.route('/tours-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictAt('admin', 'guide-lead', 'guide'), getMonthlyPlan);
router.route('/top-5-cheap').get(aliesTopTours, getAllTours);

router
  .route('/tours-within/:distance/center/:latlng/unite/:unite')
  .get(getTourWithin);
router.route('/distances/:latlng/unite/:unite').get(getDistances);

router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictAt('admin', 'guide-lead'), updateTour)
  .delete(protect, restrictAt('admin', 'guide-lead'), deleteTour);

module.exports = router;
