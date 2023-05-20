const express = require('express');
const {
  getUsers,
  getUser,
  patchUser,
  patchAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

//  GET /users — возвращает всех пользователей
userRouter.get('/', getUsers);

// //  GET /users/:userId - возвращает пользователя по _id
// userRouter.get('/users/:userId', getUser);

//  GET /users/me - возвращает информацию о текущем пользователе
userRouter.get('/me', getUser);

//  PATCH /users/me — обновляет профиль
userRouter.patch('/me', patchUser);

//  PATCH /users/me/avatar — обновляет аватар
userRouter.patch('/me/avatar', patchAvatar);

module.exports = { userRouter };
