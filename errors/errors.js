const ERROR_DEFAULT = 500;
const ERROR_NOT_FOUND = 404;
const ERROR_DATA = 400;

const handleError = (req, res, e, id) => {
  console.log('err =>', e);
  if (e.message === 'Not found') {
    res.status(ERROR_NOT_FOUND).send({ message: `ID:${id} Data not found` });
    console.log(`err ${ERROR_NOT_FOUND} =>`, e.message);
  } else if (e.name === 'ValidationError') {
    const message = Object.values(e.errors)
      .map((error) => error.message)
      .join('; ');
    res.status(ERROR_DATA).send({ message });
    console.log(`err ${ERROR_DATA} =>`, e.message);
  } else if (e.name === 'CastError') {
    res.status(ERROR_DATA).send({ message: `Incorrect ID: ${id}` });
    console.log(`err ${ERROR_DATA} =>`, e.message);
  } else {
    res.status(ERROR_DEFAULT).send({ message: 'Swth went wrong' });
    console.log(`err ${ERROR_DEFAULT} =>`, e.message);
  }
};

module.exports = {
  ERROR_DEFAULT,
  ERROR_NOT_FOUND,
  ERROR_DATA,
  handleError,
};
