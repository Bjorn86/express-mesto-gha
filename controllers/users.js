// IMPORT PACKAGES
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// IMPORT VARIABLES
const { CREATE_CODE } = require('../utils/constants');

// IMPORT MODELS
const User = require('../models/user');

// GET ALL USERS
module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// GET USER
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};

// GET USER INFO
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};

// CREATE USER
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const data = user.toObject();
      delete data.password;
      res.status(CREATE_CODE).send(data);
    })
    .catch(next);
};

// USER UPDATE COMMON METHOD
const userUpdate = (req, res, updateData, next) => {
  User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};

// UPDATE USER INFO
module.exports.updateUserInfo = (req, res, next) => {
  const updateData = req.body;
  userUpdate(req, res, updateData, next);
};

// UPDATE USER AVATAR
module.exports.updateUserAvatar = (req, res, next) => {
  const updateData = req.body;
  userUpdate(req, res, updateData, next);
};

// LOGIN
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        '2fd5f67c6932c07ff787bf9e0813eb1ae0175e15a0f2ae4b2b508a3765ab93ae',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: 'Успешный вход' });
    })
    .catch(next);
};
