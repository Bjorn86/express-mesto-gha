// IMPORT PACKAGES
const { DocumentNotFoundError } = require('mongoose').Error;

// IMPORT HANDLERS
const { errorsHandler } = require('../utils/utils');

// IMPORT VARIABLES
const { CREATE_CODE } = require('../utils/constants');

// IMPORT MODELS
const User = require('../models/user');

// GET ALL USERS
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => errorsHandler(err, res));
};

// GET USER
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new DocumentNotFoundError('Пользователь с таким ID не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => errorsHandler(err, res));
};

// CREATE USER
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATE_CODE).send(user))
    .catch((err) => errorsHandler(err, res));
};

// USER UPDATE COMMON METHOD
const userUpdate = (req, res, updateData) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
    .orFail(() => {
      throw new DocumentNotFoundError('Пользователь с таким ID не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => errorsHandler(err, res));
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
