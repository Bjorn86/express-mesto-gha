// IMPORT PACKAGES
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// IMPORT CONTROLLERS
const {
  getAllUsers,
  getUser,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

// IMPORT VARIABLES
const { LINK_REGEXP } = require('../utils/constants');

// GET ALL USERS ROUTE
router.get('/', getAllUsers);

// GET USER INFO ROUTE
router.get('/me', celebrate({
  query: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), getUserInfo);

// GET USER ROUTE
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

// UPDATE USER INFO ROUTE
router.patch('/me', celebrate({
  query: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

// UPDATE USER AVATAR ROUTE
router.patch('/me/avatar', celebrate({
  query: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
  body: Joi.object().keys({
    avatar: Joi.string().regex(LINK_REGEXP),
  }),
}), updateUserAvatar);

// MODULE EXPORT
module.exports = router;
