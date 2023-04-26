// IMPORT PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const validationErrors = require('celebrate').errors;

// IMPORT ROUTES
const rootRouter = require('./routes/index');

// IMPORT MIDDLEWARES
const limiter = require('./middlewares/limiter');
const errors = require('./middlewares/errors');

// SERVER VARIABLES
const { PORT = 3000 } = process.env;

// APP VARIABLES
const app = express();

// DATABASE CONNECT
mongoose.connect('mongodb://localhost:27017/mestodb');

// PARSERS METHODS
app.use(express.json());
app.use(cookieParser());

// DEFENSE MIDDLEWARES
app.use(helmet());
app.use(limiter);

// ROUTES METHOD
app.use('/', rootRouter);

// ERRORS HANDLER MIDDLEWARES
app.use(validationErrors());
app.use(errors);

// SERVER LISTENER
app.listen(PORT);
