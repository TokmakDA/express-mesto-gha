const User = require('../models/user');

function catchingError(req, res, e, userId) {
  console.log('err =>', e);
  if (e?.message == 'Not found') {
    res.status(404).send({ message: `${userId} User not found` });
    console.log('err 404 =>', e?.message);
  } else if (e?.name == 'ValidationError') {
    const message = Object.values(e.errors)
      .map((error) => error.message)
      .join('; ');
    res.status(400).send({ message });
    console.log('err 400 =>', e?.message);
  } else if (e?.name == 'CastError') {
    res.status(400).send({ message: `Incorrect user ID: ${userId}` });
    console.log('err 400 =>', e?.message);
  } else {
    res.status(500).send({ message: 'Swth went wrong' });
    console.log('err 500 =>', e?.message);
  }
}

// GET /users — возвращает всех пользователей
const getUsers = (req, res) => {
  console.log('getUsers =>');

  User.find()
    .then((users) => {
      res.status(200).send({ data: users });
      console.log('getUsers => all users', users);
    })
    .catch((e) => {
      catchingError(res, e);
    });
};

// GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res) => {
  console.log('getUser =>');

  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      console.log('getUser => user', user);
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      catchingError(req, res, e, userId);
    });
};

// POST /users — создаёт пользователя
// В теле POST-запроса на создание пользователя передайте JSON-объект с тремя полями: name, about и avatar.
const createUser = (req, res) => {
  console.log('createUser =>');
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
      console.log('patchUser => created user', user);
    })
    .catch((e) => {
      catchingError(req, res, e);
    });
};

// PATCH /users/me — обновляет профиль
const patchUser = (req, res) => {
  console.log('patchUser =>');

  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user });
      console.log('patchUser => updated user', user);
    })
    .catch((e) => {
      catchingError(req, res, e);
    });
};

// PATCH /users/me/avatar — обновляет аватар
const patchAvatar = (req, res) => {
  console.log('patchAvatar =>');

  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user });
      console.log('patchAvatar => updated user', user);
    })
    .catch((e) => {
      catchingError(req, res, e);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  patchUser,
  patchAvatar,
};
