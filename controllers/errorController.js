const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Inavalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
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
    err.statusCode = err.statusCode || 501;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
      status: err.status,
      messsage: err.message,
    });
  } else {
    console.log('Error 💥', err);
    res.status(501).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    console.log(error);
    sendErrorProd(error, res);
  }
};
