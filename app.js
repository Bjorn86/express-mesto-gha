// IMPORT PACKAGES
const express = require('express');
const mongoose = require('mongoose');

// IMPORT ROUTES
const rootRouter = require('./routes/index');

// SERVER VARIABLES
const { PORT = 3000 } = process.env;

// APP VARIABLES
const app = express();

// DATABASE CONNECT
mongoose.connect('mongodb://localhost:27017/mestodb');

// PARSER METHODS
app.use(express.json());

// TEMP USER MIDDLEWARE
app.use((req, res, next) => {
  req.user = {
    _id: '643d4099e0bb074137c48111',
  };
  next();
});

// ROUTES METHOD
app.use('/', rootRouter);

// SERVER LISTENER
app.listen(PORT);
