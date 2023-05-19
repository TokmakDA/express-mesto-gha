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
    console.log('checkToken => !token', false);
    return false;
  }
  try {
    return jwt.verify(token, SECKRET_KEY);
  } catch {
    return false;
  }
}

module.exports = {
  generateToken,
  checkToken,
};
