const express = require('express');
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const cardRouter = express.Router();

//  GET /cards — возвращает все карточки
cardRouter.get('/cards', getCards);

//  POST /cards — создаёт карточку
cardRouter.post('/cards', createCard);

//  DELETE /cards/:cardId — удаляет карточку по идентификатору
cardRouter.delete('/cards/:cardId', deleteCard);

//  PUT /cards/:cardId/likes — поставить лайк карточке
cardRouter.put('/cards/:cardId/likes', addLikeCard);

//  DELETE /cards/:cardId/likes — убрать лайк с карточки
cardRouter.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = { cardRouter };
