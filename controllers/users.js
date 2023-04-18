// IMPORT PACKAGES
const { ValidationError, DocumentNotFoundError } = require('mongoose').Error;

// IMPORT MODELS
const User = require('../models/user');

// STATUS CODES
const CREATE_CODE = 201;
const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

// GET ALL USERS
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send({
      message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`,
    }));
};

// GET USER
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new DocumentNotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: `${err.query}`,
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`,
      });
    });
};

// CREATE USER
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATE_CODE).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join(' ');
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные. ${errorMessage}`,
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`,
      });
    });
};

// USER UPDATE COMMON METHOD
const userUpdate = (req, res, updateData) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
    .orFail(() => {
      throw new DocumentNotFoundError('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: `${err.query}`,
        });
      }
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join(' ');
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные. ${errorMessage}`,
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`,
      });
    });
};

// UPDATE USER INFO
module.exports.updateUserInfo = (req, res) => {
  const updateData = req.body;
  userUpdate(req, res, updateData);
};

// UPDATE USER INFO
module.exports.updateUserAvatar = (req, res) => {
  const updateData = req.body;
  userUpdate(req, res, updateData);
};
