const Card = require('../models/card');

function catchingError(req, res, e, cardId) {
  console.log('err =>', e);
  if (e.message === 'Not found') {
    res.status(404).send({ message: `${cardId} Card not found` });
    console.log('err 404 =>', e.message);
  } else if (e.name === 'ValidationError') {
    const message = Object.values(e.errors)
      .map((error) => error.message)
      .join('; ');
    res.status(400).send({ message });
    console.log('err 400 =>', e.message);
  } else if (e.name === 'CastError') {
    res.status(400).send({ message: `Incorrect card ID: ${cardId}` });
    console.log('err 400 =>', e.message);
  } else {
    res.status(500).send({ message: 'Swth went wrong' });
    console.log('err 500 =>', e.message);
  }
}

//  GET /cards — возвращает все карточки
const getCards = (req, res) => {
  Card.find()
    .populate('owner')
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((e) => {
      catchingError(req, res, e);
    });
};

//  POST /cards — создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((e) => {
      catchingError(req, res, e);
    });
};

//  DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((e) => {
      catchingError(req, res, e, cardId);
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
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((e) => {
      catchingError(req, res, e, cardId);
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
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((e) => {
      catchingError(req, res, e, cardId);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
