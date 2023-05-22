const jwt = require('jsonwebtoken');

const SECKRET_KEY = 'my-secret-key';

function generateToken(payload) {
  const token = jwt.sign(payload, SECKRET_KEY, {
    expiresIn: '7d',
  });
  return token;
}

function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    return jwt.verify(token, SECKRET_KEY);
  } catch (e) {
    return false;
  }
}

module.exports = {
  generateToken,
  checkToken,
};
