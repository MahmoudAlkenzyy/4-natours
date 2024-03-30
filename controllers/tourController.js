const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // CREATE A QUERY
    //  1A) FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lte|gte|lt|gt)\b/, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    // 2)SORTING

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createAt');
    }
    // 3) FIELDS LIMIT

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    // PAGENATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.limit(limit).skip(skip);
    console.log(skip, limit, page);
    if (req.query.page) {
      const numOfelements = await Tour.countDocuments();
      if (numOfelements <= skip) throw new Error('This page does not exist');
    }

    //EXCUTE THE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requested: req.requestTime,
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    // const tour = tours.find((el) => el.id === id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: tour });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    const tours = await Tour.find();
    res.status(204).json({
      status: 'success',
      data: tours,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.aliesTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';

  req.query.fields = 'name,price,ratingsAverage,summry,difficulty';
  req.query.limit = '5';
  next();
};
