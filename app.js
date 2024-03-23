const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

//create app
const app = express();

//1) Middlewars

app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from middleware');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toString();
    next();
});

//2)Moutnting Routers

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
