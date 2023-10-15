const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const app = require('./app');

// Unhandled rejection handler
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection. Shutting Down!');
  console.log(err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotEnv.config({ path: './config.env' });

// Connecting to MongoDB Database
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect('mongodb://127.0.0.1:27017/market', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Make the Server Listening in Event Loop
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`App Running on Port ${PORT}`);
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception. Shutting Down!');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
