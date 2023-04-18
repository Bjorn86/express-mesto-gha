// IMPORT PACKAGES
const { DocumentNotFoundError } = require('mongoose').Error;

// IMPORT HANDLERS
const { errorsHandler } = require('../utils/utils');

// IMPORT VARIABLES
const { CREATE_CODE } = require('../utils/constants');

// IMPORT MODELS
const Card = require('../models/card');

// GET ALL CARDS
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => errorsHandler(err, res));
};

// CREATE CARD
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CREATE_CODE).send(card))
    .catch((err) => errorsHandler(err, res));
};

// DELETE CARD
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      throw new DocumentNotFoundError('Карточка с таким ID не найдена');
    })
    .then(() => res.send({ message: 'Пост удалён' }))
    .catch((err) => errorsHandler(err, res));
};

// CARD LIKES UPDATE COMMON METHOD
const cardLikesUpdate = (req, res, updateData) => {
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .orFail(() => {
      throw new DocumentNotFoundError('Карточка с таким ID не найдена');
    })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => errorsHandler(err, res));
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
