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
    console.log(con.connect);
  });

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`the server listening in ${port}....`);
});
