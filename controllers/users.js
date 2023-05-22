const bcrypt = require('bcrypt');
const User = require('../models/user');
const { NotFoundError } = require('../errors/errors');
const { generateToken } = require('../utils/token');

//  GET /users — возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.json({ data: users });
    })
    .catch(next);
};

//  GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(`User ${userId} is not found`);
    })
    .then((user) => {
      res.json({ data: user });
    })
    .catch(next);
};

//  GET /users/me - возвращает информацию о текущем пользователе
const getUserMe = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(`User ${userId} is not found`);
    })
    .then((user) => {
      // выбираем поля для передачи пользователю
      res.json({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
};

//  POST /signin — авторизует пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const { _id } = user;
      const token = generateToken({ _id }); // сгенерировали токен
      // вернём токен пользователю
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .status(200)
        .json({
          data: {
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          },
        }); // вернем данные
    })
    .catch(next);
};

//  GET /signup — очищает куки
const signout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Exit' });
};

//  POST /signup — создаёт пользователя
const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => {
          // выбираем данные для передачи пользователю
          res.status(201).json({
            data: {
              _id: user._id,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
            },
          }); // вернем данные
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('the user already exists'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

// PATCH /users/me — обновляет профиль
const patchUser = (req, res, next) => {
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
      throw new NotFoundError(`User ${userId} is not found`);
    })
    .then((user) => {
      res.json({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
};

// PATCH /users/me/avatar — обновляет аватар
const patchAvatar = (req, res, next) => {
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
      throw new NotFoundError(`User ${userId} is not found`);
    })
    .then((user) => {
      res.json({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getUserMe,
  login,
  signout,
  createUser,
  patchUser,
  patchAvatar,
};
