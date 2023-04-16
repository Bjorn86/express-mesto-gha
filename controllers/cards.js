// IMPORT MODELS
const Card = require('../models/card');

// GET ALL CARDS
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Oops! ${err}` }));
};

// CREATE CARD
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => card.populate('owner'))
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      likes: card.likes,
      owner: {
        name: card.owner.name,
        about: card.owner.about,
        avatar: card.owner.avatar,
        _id: card.owner._id,
      },
      createdAt: card.createdAt,
      _id: card._id,
    }))
    .catch((err) => res.status(500).send({ message: `Oops! ${err}` }));
};

// DELETE CARD
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.send({ message: 'Пост удалён' }))
    .catch((err) => res.status(500).send({ message: `Oops! ${err}` }));
};

// LIKE CARD
module.exports.likeCard = (req, res) => {
  const ownerId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: ownerId } }, { new: true })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Oops! ${err}` }));
};

// DISLIKE CARD
module.exports.dislikeCard = (req, res) => {
  const ownerId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: ownerId } }, { new: true })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Oops! ${err}` }));
};
