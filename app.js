// IMPORT PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// IMPORT ROUTES
const rootRouter = require('./routes/index');

// SERVER VARIABLES
const { PORT = 3000 } = process.env;

// APP VARIABLES
const app = express();

// DATABASE CONNECT
mongoose.connect('mongodb://localhost:27017/mestodb');

// PARSERS METHODS
app.use(express.json());
app.use(cookieParser());

// ROUTES METHOD
app.use('/', rootRouter);

// SERVER LISTENER
app.listen(PORT);
