const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  patchUser,
  patchAvatar,
} = require('../controllers/users');
const userRouter = express.Router();

// GET /users — возвращает всех пользователей
userRouter.get('/users', getUsers);

// GET /users/:userId - возвращает пользователя по _id
userRouter.get('/users/:userId', getUser);

// POST /users — создаёт пользователя
// В теле POST-запроса на создание пользователя передайте JSON-объект с тремя полями:
// name, about и avatar.
userRouter.post('/users', createUser);

// PATCH /users/me — обновляет профиль
userRouter.patch('/users/me', patchUser);

// PATCH /users/me/avatar — обновляет аватар
userRouter.patch('/users/me/avatar', patchAvatar);

module.exports = { userRouter };
