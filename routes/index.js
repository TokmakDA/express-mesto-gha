const { cardRouter } = require('./cards');
const { userRouter } = require('./users');

module.exports = require('express')
  .Router()
  .use('/cards', cardRouter)
  .use('/users', userRouter);
