// IMPORT PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// IMPORT ROUTES
const users = require('./routes/users');
const cards = require('./routes/cards');

// SERVER VARIABLES
const { PORT = 3000 } = process.env;

// APP VARIABLES
const app = express();

// DATABASE CONNECT
mongoose.connect('mongodb://localhost:27017/mestodb');

// PARSER METHODS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TEMP USER MIDDLEWARE
app.use((req, res, next) => {
  req.user = {
    _id: '643ac76a5ef140c3000bad0d',
  };

  next();
});

// ROUTES METHODS
app.use('/users', users);
app.use('/cards', cards);

// SERVER LISTENER
app.listen(PORT);
