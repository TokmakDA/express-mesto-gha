const SomeError = require('./SomeError');

class BadRequestError extends SomeError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
  }
}

module.exports = {
  BadRequestError,
};
