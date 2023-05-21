const SomeError = require('./SomeError');

// this.message = 'Internal Server Error';
class DefaltError extends SomeError {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.name = 'DefaltError';
  }
}

module.exports = { DefaltError };
