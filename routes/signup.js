// IMPORT PACKAGES
const router = require('express').Router();

// IMPORT CONTROLLERS
const { createUser } = require('../controllers/users');

// LOGIN ROUTE
router.post('/', createUser);

// MODULE EXPORT
module.exports = router;
