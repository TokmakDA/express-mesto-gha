const bcrypt = require('bcrypt');
const User = require('../models/user');
const { NotFoundError } = require('../errors/errors');
const { generateToken } = require('../utils/token');

//  GET /users — возвращает всех пользователей
const getUsers = (req, res, next) => {
  //  потом удалить
  console.log('getUser => req.cookie.jwt', req.cookies.jwt);
  User.find()
    .then((users) => {
      res.status(200).json({ data: users });
    })
    .catch((err) => {
      console.log('getUsers => err', err);
      next(err);
    });
};

//  GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res, next) => {
  console.log('getUser => ');

  const { userId } = req.params;
  console.log('getUser => req.params', userId);

  User.findById(userId)
    .orFail(() => {
      console.log('getUser => orFail');
      throw new NotFoundError(`User ${userId} is not found`);
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

//  GET /users/me - возвращает информацию о текущем пользователе
const getUserMe = (req, res, next) => {
  //  потом удалить
  console.log(
    'getUser => req.user , req.cookies.jwt',
    req.user,
    req.cookies.jwt,
  );

  // if (req.params) {
  //   const {peram} = req.params
  //   console.log('getUserMe => req.params => getUser', peram);
  //   getUser;
  // }

  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      console.log('getUser => orFail');
      throw new NotFoundError(`User ${userId} is not found`);
    })
    .then((user) => {
      // выбираем поля для передачи пользователю
      res.status(200).json({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      next(err);
    });
};

//  POST /signin — авторизует пользователя
const login = (req, res, next) => {
  //  потом удалить
  console.log('login => req.body', req.body);
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // выбираем данные для передачи пользователю
      console.log('login =>', user);
      const { _id } = user;
      const token = generateToken({ _id }); // сгенерировали токен
      // вернём токен
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
    .catch((err) => {
      console.log('login => err', err);
      next(err);
    });
};

//  POST /signup — создаёт пользователя
const createUser = (req, res, next) => {
  //  потом удалить
  console.log('createUser => req.body', req.body);
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
          console.log('createUser => create => err', err);
          next(err);
        });
    })
    .catch((err) => {
      console.log('createUser => hashPassword => err', err);
      next(err);
    });
};

// PATCH /users/me — обновляет профиль
const patchUser = (req, res, next) => {
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
      console.log('getUser => orFail');
      throw new NotFoundError(`User ${userId} is not found`);
    })
    .then((user) => {
      res.status(200).json({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      console.log('patchUser => err', err);
      next(err);
    });
};

// PATCH /users/me/avatar — обновляет аватар
const patchAvatar = (req, res, next) => {
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
      console.log('patchAvatar => orFail');
      throw new NotFoundError(`User ${userId} is not found`);
    })
    .then((user) => {
      res.status(200).json({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      console.log('patchAvatar => err', err);
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserMe,
  login,
  createUser,
  patchUser,
  patchAvatar,
};
