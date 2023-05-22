const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { cardSchema } = require('../utils/schemes');
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const cardRouter = express.Router();

//  GET /cards — возвращает все карточки
cardRouter.get('/', getCards);

//  POST /cards — создаёт карточку
cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys(cardSchema).unknown(true),
  }),
  createCard,
);

//  DELETE /cards/:cardId — удаляет карточку по идентификатору
cardRouter.delete('/:cardId', deleteCard);

//  PUT /cards/:cardId/likes — поставить лайк карточке
cardRouter.put('/:cardId/likes', addLikeCard);

//  DELETE /cards/:cardId/likes — убрать лайк с карточки
cardRouter.delete('/:cardId/likes', deleteLikeCard);

module.exports = { cardRouter };
