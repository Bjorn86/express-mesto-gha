// IMPORT PACKAGES
const rootRouter = require('express').Router();

// IMPORT ROUTES
const users = require('./users');
const cards = require('./cards');

// ROUTES METHODS
rootRouter.use('/users', users);
rootRouter.use('/cards', cards);

// EXPORT ROUTES
module.exports = rootRouter;
