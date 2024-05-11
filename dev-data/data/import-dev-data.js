const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB);

//Reading File

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
//IMPORT DATA FROM JSON
const importData = async () => {
  try {
    await Tour.create(tours);
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
