const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
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

//Read data from system file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
///2) Routes Handlers

const getAllTours = (req, res) => {
    res.status(200).json({ status: 'success', requested: req.requestTime, results: tours.length, data: { tours } });
};

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }
    res.status(200).json({
        status: 'success',
        data: { tour },
    });
};

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }
    res.status(200).json({ status: 'success', data: '<Updated tour>' });
};
const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    if (tours.length < id) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: { tour: newTour },
        });
        console.log(err.message);
    });
    console.log(newTour);
};
//Get All Tours
// app.get('/api/v1/tours', getAllTours);

// // Create new Tour
// app.post('/api/v1/tours', createTour);

// //Get Tour
// app.get('/api/v1/tours/:id', getTour);

// //Update Tour
// app.patch('/api/v1/tours/:id', updateTour);

// //Delete Tour
// app.delete('/api/v1/tours/:id', deleteTour);

//3)Routes

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

// 4)Start Server
const port = 3000;
app.listen(port, () => {
    console.log(`the server listening in ${port}....`);
});
