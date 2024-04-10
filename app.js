const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

//create app
const app = express();

//1) Middlewars

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  next();
});

//2)Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    messsage: `Can't find ${req.originalUrl} on this server`,
  });
});
module.exports = app;
