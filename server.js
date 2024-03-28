const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(
    DB,
    //   , {
    //   useNewUrlParser:true,
    //   useUnifiedTopology:true,
    //   useFindAndModify:false,
    // }
  )
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connected successfuly');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
// tourSchema.plugin(uniqueValidator);
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forst Hiker',
  price: 495,
  rating: 4.7,
});
testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log(err));

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`the server listening in ${port}....`);
});
