const { ERROR_NOT_FOUND } = require('../errors/errors');
const { cardRouter } = require('./cards');
const { userRouter } = require('./users');

module.exports = require('express')
  .Router()
  .use(cardRouter)
  .use(userRouter)
  .use((req, res) => {
    res.status(ERROR_NOT_FOUND).send({ message: 'Not found' });
  });
