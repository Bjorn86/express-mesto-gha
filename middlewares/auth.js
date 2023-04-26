// IMPORT PACKAGES
const jwt = require('jsonwebtoken');

// IMPORT ERRORS
const AuthorizationError = require('../errors/authorizationError');

// AUTHORIZATION MIDDLEWARE
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthorizationError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, '2fd5f67c6932c07ff787bf9e0813eb1ae0175e15a0f2ae4b2b508a3765ab93ae');
  } catch (err) {
    return new AuthorizationError('Необходима авторизация');
  }
  req.user = payload;
  return next();
};
