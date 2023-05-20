const User = require('../models/user');
const bcrypt = require('bcrypt');
const { handleError } = require('../errors/errors');
const { generateToken } = require('../utils/token');

//  GET /users — возвращает всех пользователей
const getUsers = (req, res) => {
  console.log('getUser => req.cookie.jwt', req.cookies.jwt);
  User.find()
    .then((users) => {
      res.status(200).json({ data: users });
    })
    .catch((err) => {
      console.log('getUsers => err', err);
      handleError(err, req, res);
    });
};

//  GET /users/me - возвращает информацию о текущем пользователе
const getUser = (req, res) => {
  console.log(
    'getUser => req.user , req.cookies.jwt',
    req.user,
    req.cookies.jwt,
  );
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      // выбираем поля для передачи пользователю
      const { _id, name, about, email } = user;
      res.status(200).json({ data: { _id, name, about, email } });
    })
    .catch((err) => {
      console.log('getUser => err', err);
      handleError(err, req, res, userId);
    });
};

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

//  POST /signin — авторизует пользователя
const login = (req, res) => {
  console.log('login => req.body', req.body);
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // выбираем данные для передачи пользователю
      const { _id, name, about, email } = user;
      const token = generateToken({ _id }); // сгенерировали токен
      // вернём токен
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .status(200)
        .json({ data: { _id, name, about, email } }); // вернем данные
    })
    .catch((err) => {
      console.log('login => err', err);
      res.status(401).json({ message: err.message });
    });
};

//  POST /signup — создаёт пользователя
const createUser = (req, res) => {
  console.log('createUser => req.body', req.body);
  const { email, password } = req.body;
  hashPassword(password)
    .then((hash) =>
      User.create({
        email,
        password: hash,
      }).then((user) => {
        // выбираем данные для передачи пользователю
        const { _id, name, about, email } = user;
        res.status(201).json({ data: { _id } }); // вернем данные
      }),
    )
    .catch((err) => {
      console.log('createUser => err', err);
      handleError(err, req, res);
    });
};

// PATCH /users/me — обновляет профиль
const patchUser = (req, res) => {
  console.log(
    'patchUser => req.body, req.user, req.cookies.jwt',
    req.body,
    req.user,
    req.cookies.jwt,
  );
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
      const { _id, name, about, email } = user;
      res.status(200).json({ data: { _id, name, about, email } });
    })
    .catch((err) => {
      console.log('patchUser => err', err);
      handleError(err, req, res, userId);
    });
};

// PATCH /users/me/avatar — обновляет аватар
const patchAvatar = (req, res) => {
  console.log(
    'patchAvatar => req.body, req.user, req.cookies.jwt',
    req.body,
    req.user,
    req.cookies.jwt,
  );
  const { avatar } = req.body;
  const userId = req.user._id;
  console.log(userId);
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
      const { _id, name, about, email } = user;
      res.status(200).json({ data: { _id, name, about, email } });
    })
    .catch((err) => {
      console.log('patchAvatar => err', err);
      handleError(err, req, res, userId);
    });
};

module.exports = {
  getUsers,
  getUser,
  login,
  createUser,
  patchUser,
  patchAvatar,
};
