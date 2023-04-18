// IMPORT PACKAGES
const rootRouter = require('express').Router();

// IMPORT ROUTES
const users = require('./users');
const cards = require('./cards');
const notFound = require('./notFound');

// ROUTES METHODS
rootRouter.use('/users', users);
rootRouter.use('/cards', cards);
rootRouter.use('*', notFound);

// EXPORT ROUTES
module.exports = rootRouter;
