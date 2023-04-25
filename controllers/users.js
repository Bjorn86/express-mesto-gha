// IMPORT PACKAGES
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => errorsHandler(err, res));
};

// GET USER INFO
module.exports.getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => errorsHandler(err, res));
};

// CREATE USER
module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (password.length < 8) {
    throw new Error('Минимальная длинна пароля 8 символов'); // TODO доработать с учётом общего обработчика ошибок
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATE_CODE).send(user))
    .catch((err) => errorsHandler(err, res));
};

// USER UPDATE COMMON METHOD
const userUpdate = (req, res, updateData) => {
  User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => errorsHandler(err, res));
};

// UPDATE USER INFO
module.exports.updateUserInfo = (req, res) => {
  const updateData = req.body;
  userUpdate(req, res, updateData);
};

// UPDATE USER AVATAR
module.exports.updateUserAvatar = (req, res) => {
  const updateData = req.body;
  userUpdate(req, res, updateData);
};

// LOGIN
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: 'Успешный вход' });
    })
    .catch((err) => {
      res.status(401).send({
        message: err.message,
      });
    });
};
