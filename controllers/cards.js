// IMPORT VARIABLES
const { CREATE_CODE } = require('../utils/constants');

// IMPORT MODELS
const Card = require('../models/card');

// GET ALL CARDS
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

// CREATE CARD
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CREATE_CODE).send(card))
    .catch(next);
};

// DELETE CARD
module.exports.deleteCard = (req, res, next) => {
  Card.deleteOne({ _id: req.params.cardId, owner: req.user._id })
    .orFail()
    .then(() => res.send({ message: 'Пост удалён' }))
    .catch(next);
};

// CARD LIKES UPDATE COMMON METHOD
const cardLikesUpdate = (req, res, updateData, next) => {
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .orFail()
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch(next);
};

// LIKE CARD
module.exports.likeCard = (req, res, next) => {
  const ownerId = req.user._id;
  const updateData = { $addToSet: { likes: ownerId } };
  cardLikesUpdate(req, res, updateData, next);
};

// DISLIKE CARD
module.exports.dislikeCard = (req, res, next) => {
  const ownerId = req.user._id;
  const updateData = { $pull: { likes: ownerId } };
  cardLikesUpdate(req, res, updateData, next);
};
