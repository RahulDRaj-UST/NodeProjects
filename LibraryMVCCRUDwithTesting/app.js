const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB
require('./DB_Connect/initDB')();

const BookRoute = require('./Routes/book');
app.use('/books', BookRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});

module.exports = app;
