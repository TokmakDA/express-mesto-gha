const Card = require('../models/card');
const { handleError } = require('../errors/errors');

//  GET /cards — возвращает все карточки
const getCards = (req, res) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((e) => {
      handleError(req, res, e);
    });
};

//  POST /cards — создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => Card.findById(card._id).populate(['owner', 'likes']))
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((e) => {
      handleError(req, res, e);
    });
};

//  DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((e) => {
      handleError(req, res, e, cardId);
    });
};

//  PUT /cards/:cardId/likes — поставить лайк карточке
const addLikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((e) => {
      handleError(req, res, e, cardId);
    });
};

//  DELETE /cards/:cardId/likes — убрать лайк с карточки
const deleteLikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((e) => {
      handleError(req, res, e, cardId);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
