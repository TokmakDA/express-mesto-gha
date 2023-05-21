const SomeError = require('./SomeError');

// this.message = 'The user already exists';
class ConflictError extends SomeError {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'ConflictError';
  }
}

module.exports = {
  ConflictError,
};
