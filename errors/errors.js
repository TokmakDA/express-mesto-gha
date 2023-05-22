const { BadRequestError } = require('./BadRequestError');
const { ConflictError } = require('./ConflictError');
const { DefaltError } = require('./DefaltError');
const { ForbiddenError } = require('./ForbiddenError');
const { NotFoundError } = require('./NotFoundError');
const SomeError = require('./SomeError');
const { UnauthorizedError } = require('./UnauthorizedError');

const returnErrorToUser = (err, req, res) => {
  console.log(
    'handleError => прошел все проверки и выдает ошибку пользователю => returnErrorToUser =>',
    err.name,
    err.statusCode,
    err.message,
  );

  res
    .status(err.statusCode ?? 501)
    .send({ message: err.message ?? 'unexpected error' })
    .end();
};

function handleError(err, req, res, next) {
  console.log('handleError => ', err);
  // Вернуть ошибку пользователю

  if (err instanceof SomeError) {
    console.log(`handleError =>  ${err.statusCode} =>`, err.name, err.message);

    returnErrorToUser(err, req, res);
  } else if (err.name === 'CastError') {
    const newErr = new BadRequestError('Incorrect ID');
    // err.message = `Incorrect ID`;
    // err.statusCode = ERROR_BAD_REQUEST;
    //  потом удалить
    console.log(
      `handleError => CastError ${newErr.statusCode} =>`,
      newErr.name,
      newErr.message,
    );

    returnErrorToUser(newErr, req, res);
  } else if (err.code === 11000) {
    const newErr = new ConflictError('the user already exists');
    returnErrorToUser(newErr, req, res);
  } else if (err.name === 'ValidationError') {
    console.log(`handleError => ValidationError  =>`, err);
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join('; ');

    console.log(
      `handleError => ValidationError ${err.statusCode} =>`,
      err.name,
      err.message,
    );

    const newErr = new BadRequestError(err.message);
    returnErrorToUser(newErr, req, res);
  } 
  // Ошибки перехваченные от celebrate
  else if (err.message === 'Validation failed') {
    console.log(`handleError => Validation failed  =>`, err);
    next(err);
  } else {
    const newErr = new DefaltError('Swth went wrong');
    console.log(
      `handleError =>  DefaltError ${newErr.statusCode} =>`,
      newErr.name,
      newErr.message,
    );

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
