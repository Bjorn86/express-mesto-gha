// IMPORT PACKAGES
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

// USER SCHEMA
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты', // TODO добавить такие сообщения везде где может появиться ошибка валидации
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, {
  versionKey: false,
  // FIND USER BY CREDENTIALS METHOD
  statics: {
    findUserByCredentials(email, password) {
      return this.findOne({ email }).select('+password')
        .then((user) => {
          if (!user) {
            return Promise.reject(new Error('Неправильная почта или пароль'));
          }
          return bcrypt.compare(password, user.password)
            .then((matched) => {
              if (!matched) {
                return Promise.reject(new Error('Неправильная почта или пароль'));
              }
              return user;
            });
        });
    },
  },
});

// MODULE EXPORT
module.exports = mongoose.model('user', userSchema);
