const SomeError = require('./SomeError');

class ForbiddenError extends SomeError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'ForbiddenError';
  }
}

module.exports = {
  ForbiddenError,
};
