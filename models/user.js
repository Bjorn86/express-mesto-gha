// IMPORT PACKAGES
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

// IMPORT VARIABLES
const { LINK_REGEXP } = require('../utils/constants');

// USER SCHEMA
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" 2 символа'],
    maxlength: [30, 'Максимальная длина поля "about" 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => LINK_REGEXP.test(v),
      message: 'Неправильный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    minlength: [8, 'Минимальная длина поля "password" 8 символов'],
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
