// IMPORT MODELS
const User = require('../models/user');

// GET ALL USERS
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Oops! ${err}` }));
};

// GET USER
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => res.status(500).send({ message: `Oops! ${err}` }));
};

// CREATE USER
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => res.status(500).send({ message: `Oops! ${err}` }));
};

// UPDATE USER INFO
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Oops! ${err}` }));
};

// UPDATE USER INFO
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Oops! ${err}` }));
};
