const User = require('../models/user');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { handleError } = require('../errors/errors');
const { generateToken } = require('../utils/token');

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

// //  GET /users/:userId - возвращает пользователя по _id
// const getUser = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail(() => {
//       throw new Error('Not found');
//     })
//     .then((user) => {
//       res.status(200).send({ data: user });
//     })
//     .catch((e) => {
//       handleError(req, res, e, userId);
//     });
// };

//  GET /users/me - возвращает информацию о текущем пользователе
const getUserMe = (req, res) => {
  const userId = req.user._id;
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

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

//  POST /signin — авторизует пользователя
const login = (req, res) => {
  console.log('login =>', req.body);
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const { _id } = user;
      const token = generateToken({ _id }); // сгенерировали токен
      // вернём токен
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

//  POST /signup — создаёт пользователя
const createUser = (req, res) => {
  console.log('createUser =>', req.body);
  const { email, password } = req.body;
  hashPassword(password)
    .then((hash) =>
      User.create({
        email,
        password: hash,
      }).then((user) => {
        const { _id } = user;
        console.log('createUser => hashPassword =>', { _id });
        res.status(201).json({ data: { _id } });
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
  // getUser,
  getUserMe,
  login,
  createUser,
  patchUser,
  patchAvatar,
};
