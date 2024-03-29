const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'the tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'The tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'the tour must have a summery'],
  },
  discription: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    require: [true, 'A tour must have a image cover'],
  },
  images: [String],
  createAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});
// tourSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Tour', tourSchema);
