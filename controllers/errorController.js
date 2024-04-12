const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Inavalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};
const handleDublicateFieldsDB = (err) => {
  const value = JSON.stringify(err.keyValue);

  const message = `Inavalid ${value}: please use another value `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `inavalid input data : ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  err.statusCode = err.statusCode || 501;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    messsage: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperation) {
    res.status(err.statusCode).json({
      status: err.status,
      messsage: err.message,
    });
  } else {
    console.log('Error 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
      err,
    });
  }
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDublicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};
