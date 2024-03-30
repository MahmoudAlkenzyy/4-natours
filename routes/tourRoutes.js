const express = require('express');
const {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  aliesTopTours,
} = require('../controllers/tourController');

const router = express.Router();
// router.param('id', checkID);
router.route('/top-5-cheap').get(aliesTopTours, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
