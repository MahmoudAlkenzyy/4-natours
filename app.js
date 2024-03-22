const fs = require('fs');
const express = require('express');

//create app
const app = express();

//1) Middlewars

app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from middleware');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toString();
    next();
});

//Read data from system file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
///2) Routes Handlers

// 4)Start Server
const port = 3000;
app.listen(port, () => {
    console.log(`the server listening in ${port}....`);
});
