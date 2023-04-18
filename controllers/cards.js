// IMPORT PACKAGES
const {
  ValidationError,
  DocumentNotFoundError,
  CastError,
} = require('mongoose').Error;

// IMPORT MODELS
const Card = require('../models/card');

// STATUS CODES
const CREATE_CODE = 201;
const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

// GET ALL CARDS
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send({
      message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`,
    }));
};

// CREATE CARD
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CREATE_CODE).send(card))
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

// DELETE CARD
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      throw new CastError();
    })
    .then(() => res.send({ message: 'Пост удалён' }))
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: `Указанная карточка не найдена ${err.message}`,
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`,
      });
    });
};

// CARD LIKES UPDATE COMMON METHOD
const cardLikesUpdate = (req, res, updateData) => {
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .orFail(() => {
      throw new DocumentNotFoundError('Указанная карточка не найдена');
    })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: `${err.query}`,
        });
      }
      if (err instanceof CastError) {
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Некорректно передан ID карточки. ${err.message}`,
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`,
      });
    });
};

// LIKE CARD
module.exports.likeCard = (req, res) => {
  const ownerId = req.user._id;
  const updateData = { $addToSet: { likes: ownerId } };
  cardLikesUpdate(req, res, updateData);
};

// DISLIKE CARD
module.exports.dislikeCard = (req, res) => {
  const ownerId = req.user._id;
  const updateData = { $pull: { likes: ownerId } };
  cardLikesUpdate(req, res, updateData);
};
