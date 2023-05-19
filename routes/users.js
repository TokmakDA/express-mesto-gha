const express = require('express');
const {
  getUsers,
  // getUser,
  patchUser,
  patchAvatar,
  getUserMe,
} = require('../controllers/users');

const userRouter = express.Router();

//  GET /users — возвращает всех пользователей
userRouter.get('/users', getUsers);

// //  GET /users/:userId - возвращает пользователя по _id
// userRouter.get('/users/:userId', getUser);

//  GET /users/me - возвращает информацию о текущем пользователе
userRouter.get('/users/me', getUserMe);

//  PATCH /users/me — обновляет профиль
userRouter.patch('/users/me', patchUser);

//  PATCH /users/me/avatar — обновляет аватар
userRouter.patch('/users/me/avatar', patchAvatar);

module.exports = { userRouter };
