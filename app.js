const express = require('express');
const morgan = require('morgan');
const rateLimate = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHanlder = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

//create app
const app = express();

//1)Global Middlewars
// send security headers
app.use(helmet());

//development logges
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limite number of requests of the same api
const limiter = rateLimate({
  max: 100,
  windowMs: 1000 * 60 * 60,
  message: 'too many requests to this IP please try again in an hour',
});
app.use('/api', limiter);

//body parser, read data from the body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitiz against NoSqul query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

//Preventing parameter plooution
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'maxGroupSize',
    ],
  }),
);

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  next();
});

//2)Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHanlder);

module.exports = app;
