const { BadRequestError } = require('./BadRequestError');
const { ConflictError } = require('./ConflictError');
const { DefaltError } = require('./DefaltError');
const { ForbiddenError } = require('./ForbiddenError');
const { NotFoundError } = require('./NotFoundError');
const SomeError = require('./SomeError');
const { UnauthorizedError } = require('./UnauthorizedError');

// Вернуть ошибку пользователю
const returnErrorToUser = (err, req, res) => {
  res.status(err.statusCode).send({ message: err.message }).end();
};

function handleError(err, req, res, next) {
  console.log('handleError => ', err);

  if (err instanceof SomeError) {
    returnErrorToUser(err, req, res);
  } else if (err.name === 'CastError') {
    const newErr = new BadRequestError('Incorrect ID');
    returnErrorToUser(newErr, req, res);
  } else if (err.code === 11000) {
    const newErr = new ConflictError('the user already exists');
    returnErrorToUser(newErr, req, res);
  } else if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join('; ');

    const newErr = new BadRequestError(message);
    returnErrorToUser(newErr, req, res);
  } else if (err.message === 'Validation failed') {
    // Ошибки перехваченные от celebrate
    next(err);
  } else {
    const newErr = new DefaltError('Swth went wrong');
    returnErrorToUser(newErr, req, res);
  }
}

module.exports = {
  handleError,
  BadRequestError,
  ConflictError,
  DefaltError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
};
