const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION💥 Shetting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

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

const server = app.listen(port, () => {
  console.log(`the server listening in ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.message);
  console.log('unHandled rejection 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
