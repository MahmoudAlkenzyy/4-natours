const Tour = require('../models/tourModel');
const catchAsync = require('./catchAsync');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.getAllTours = getAll(Tour);
exports.getTour = getOne(Tour, { path: 'reviews' });
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);

exports.aliesTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';

  req.query.fields = 'name,price,ratingsAverage,summry,difficulty';
  req.query.limit = '5';
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params;

  const montlyPlan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-1-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $sort: { numToursStarts: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: montlyPlan,
  });
});
