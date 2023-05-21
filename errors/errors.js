const ERROR_DEFAULT = 500;
const ERROR_NOT_FOUND = 404;
const ERROR_BAD_REQUEST = 400;
const ERROR_UNAUTHORIZED = 401;
const ERROR_CONFLICT = 409;
const ERROR_FORBIDDEN = 403;

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_UNAUTHORIZED;
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_FORBIDDEN;
    this.name = 'ForbiddenError';
  }
}
// this.message = 'Internal Server Error';
class DefaltError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_DEFAULT;
    this.name = 'DefaltError';
  }
}
// this.message = 'The user already exists';
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CONFLICT;
    this.name = 'ConflictError';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NOT_FOUND;
    this.name = 'NotFoundError';
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_BAD_REQUEST;
    this.name = 'BadRequestError';
  }
}

function handleError(err, req, res) {
  console.log('handleError => ');
  // Вернуть ошибку пользователю
  const returnErrorToUser = (err, req, res) => {
    console.log(
      'handleError => прошел все проверки и выдает ошибку пользователю',
      err?.name,
      err?.statusCode,
      err?.message,
    );

    res
      .status(err.statusCode ? err.statusCode : 501)
      .send({ message: err.message ? err.message : 'unexpected error' })
      .end();
  };

  if (
    err.name === 'UnauthorizedError' ||
    err.name === 'ForbiddenError' ||
    err.name === 'NotFoundError' ||
    err.name === 'DefaltError'
  ) {
    console.log(`handleError =>  ${err.statusCode} =>`, err.name, err.message);

    returnErrorToUser(err, req, res);
  } else if (err.name === 'CastError') {
    err.message = `Incorrect ID`;
    err.statusCode = ERROR_BAD_REQUEST;
    //  потом удалить
    console.log(
      `handleError => CastError ${err.statusCode} =>`,
      err.name,
      err.message,
    );

    returnErrorToUser(err, req, res);
  } else if (err.code === 11000) {
    returnErrorToUser(new ConflictError('the user already exists'), req, res);
  } else if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join('; ');

    console.log(
      `handleError => ValidationError ${err.statusCode} =>`,
      err.name,
      err.message,
    );
    returnErrorToUser(new BadRequestError(message), req, res);
  } else {
    const err = new DefaltError('Swth went wrong');
    console.log(
      `handleError =>  DefaltError ${err.statusCode} =>`,
      err.name,
      err.message,
    );

    returnErrorToUser(err, req, res);
  }
}

module.exports = {
  handleError,
  UnauthorizedError,
  ForbiddenError,
  DefaltError,
  ConflictError,
  NotFoundError,
};
