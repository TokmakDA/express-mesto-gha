const Card = require('../models/card');
const { ForbiddenError, NotFoundError } = require('../errors/errors');

//  GET /cards — возвращает все карточки
const getCards = (req, res, next) => {
  console.log(
    'GET /cards getCards => req.user, req.cookies.jwt',
    req.user,
    req.cookies.jwt,
  );
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

//  POST /cards — создаёт карточку
const createCard = (req, res, next) => {
  console.log(
    'POST /cards createCard => req.body, req.user, req.cookies.jwt',
    req.body,
    req.user,
    req.cookies.jwt,
  );
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => Card.findById(card._id).populate(['owner', 'likes']))
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

//  DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  console.log(
    'DELETE /cards/:cardId deleteCard => req.params, req.user, req.cookies.jwt',
    req.params,
    req.user,
    req.cookies.jwt,
  );
  const { cardId } = req.params;

  Card.findById(cardId)
    .populate(['owner', 'likes'])
    .orFail(() => {
      console.log('deleteLikeCard => orFail');
      throw new NotFoundError(`Card ${cardId} is not found`);
    })
    .then((card) => {
      if (card.owner._id == req.user._id) {
        Card.findByIdAndRemove(cardId)
          .orFail(() => {
            throw new Error('Not found');
          })
          .then(() => {
            res.status(200).send({
              message: `card with id: ${cardId} successfully deleted`,
            });
          });
        return;
      }
      throw new ForbiddenError(`You are not the owner Card: ID ${cardId}`);
    })
    .catch((err) => {
      next(err);
    });
};

//  PUT /cards/:cardId/likes — поставить лайк карточке
const addLikeCard = (req, res, next) => {
  console.log(
    'PUT /cards/:cardId/likes addLikeCard => req.params, req.user, req.cookies.jwt',
    req.params,
    req.user,
    req.cookies.jwt,
  );
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      console.log('addLikeCard => orFail');
      throw new NotFoundError(`Card ${cardId} is not found`);
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

//  DELETE /cards/:cardId/likes — убрать лайк с карточки
const deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      console.log('deleteLikeCard => orFail');
      throw new NotFoundError(`Card ${cardId} is not found`);
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
