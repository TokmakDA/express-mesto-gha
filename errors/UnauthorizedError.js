const SomeError = require('./SomeError');

class UnauthorizedError extends SomeError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'UnauthorizedError';
  }
}

module.exports = { UnauthorizedError };
