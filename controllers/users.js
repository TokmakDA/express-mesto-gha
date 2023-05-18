const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { handleError } = require('../errors/errors');

//  GET /users — возвращает всех пользователей
const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((e) => {
      handleError(req, res, e);
    });
};

//  GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      handleError(req, res, e, userId);
    });
};

//  POST /signin — авторизует пользователя
const login = (req, res) => {};

//  POST /signup — создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }).then((user) => {
        res.status(201).send({ data: user });
      }),
    )
    .catch((e) => {
      handleError(req, res, e);
    });
};

// PATCH /users/me — обновляет профиль
const patchUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((e) => {
      handleError(req, res, e, userId);
    });
};

// PATCH /users/me/avatar — обновляет аватар
const patchAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((e) => {
      handleError(req, res, e, userId);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  patchUser,
  patchAvatar,
};
