// IMPORT PACKAGES
const router = require('express').Router();

// IMPORT CONTROLLERS
const { login } = require('../controllers/users');

// LOGIN ROUTE
router.post('/', login);

// MODULE EXPORT
module.exports = router;
