const SomeError = require('./SomeError');

class NotFoundError extends SomeError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

module.exports = { NotFoundError };
