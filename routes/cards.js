// IMPORT PACKAGES
const router = require('express').Router();

// IMPORT CONTROLLERS
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// GET ALL CARDS
router.get('/', getAllCards);

// CREATE CARD
router.post('/', createCard);

// DELETE CARD
router.delete('/:cardId', deleteCard);

// LIKE CARD
router.put('/:cardId/likes', likeCard);

// LIKE CARD
router.delete('/:cardId/likes', dislikeCard);

// MODULE EXPORT
module.exports = router;
