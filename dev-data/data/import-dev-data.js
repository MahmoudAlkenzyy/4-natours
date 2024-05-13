const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB);

//Reading File

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));
//IMPORT DATA FROM JSON
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('successfuly');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
//DELETE ALL DATA FROM DB
const deletingData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('deleting successfuly');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--delete') {
  deletingData();
} else if (process.argv[2] === '--import') {
  importData();
}
console.log(process.argv);
