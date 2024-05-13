const AppError = require('../utils/appError');
const catchAsync = require('./catchAsync');
const APIFeatures = require('../utils/apiFeature');

exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    const data = await model.findByIdAndDelete(req.params.id);
    if (!data) {
      return next(new AppError('No document found with that ID'));
    }

    res.status(204).json({
      status: 'success',
      data: { data },
    });
  });

exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    const data = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      return next(new AppError('No document found with that ID'));
    }
    res.status(200).json({ status: 'success', data: { data } });
  });

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    const documen = await model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { data: documen },
    });
  });

exports.getOne = (model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = model.findById(id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    // const tour = tours.find((el) => el.id === id);

    if (!doc) {
      return next(new AppError('No document found with that ID'));
    }
    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    // for reviews (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //EXCUTE THE QUERY
    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagenation();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requested: req.requestTime,
      results: tours.length,
      data: { tours },
    });
  });
