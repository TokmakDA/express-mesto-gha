const ERROR_DEFAULT = 500;
const ERROR_NOT_FOUND = 404;
const ERROR_DATA = 400;
const ERROR_UNAUTHORIZED = 401;
const ERROR_CONFLICT = 409;

const handleError = (err, req, res, id) => {
  // console.log('err =>', e);
  if (err.message === 'Unauthorized Error') {
    res.status(ERROR_UNAUTHORIZED).send({ message: `Unauthorized Error` });
    console.log(`err ${ERROR_UNAUTHORIZED} =>`, err.message);
  } else if (err.message === 'Not found') {
    res.status(ERROR_NOT_FOUND).send({ message: `ID:${id} Data not found` });
    console.log(`err ${ERROR_NOT_FOUND} =>`, err.message);
  } else if (err.code === 11000) {
    res.status(ERROR_CONFLICT).send({ message: `the user already exists` });
    console.log(`err ${ERROR_CONFLICT} => `, err.message);
  } else if (err.message === 'You are not the owner') {
    res
      .status(ERROR_UNAUTHORIZED)
      .send({ message: `You are not the owner Card: ID ${id}` });
    console.log(`err ${ERROR_UNAUTHORIZED} =>`, err.message);
  } else if (err.name === 'ValidationError') {
    const message = Object.values(e.errors)
      .map((error) => error.message)
      .join('; ');
    res.status(ERROR_DATA).send({ message });
    console.log(`err ${ERROR_DATA} =>`, err.message);
  } else if (err.name === 'CastError') {
    res.status(ERROR_DATA).send({ message: `Incorrect ID: ${id}` });
    console.log(`err ${ERROR_DATA} =>`, err.message);
  } else {
    res.status(ERROR_DEFAULT).send({ message: 'Swth went wrong' });
    console.log(`err ${ERROR_DEFAULT} =>`, err.message);
  }
};

module.exports = {
  ERROR_DEFAULT,
  ERROR_NOT_FOUND,
  ERROR_DATA,
  handleError,
};
