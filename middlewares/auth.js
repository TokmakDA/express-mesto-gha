const { UnauthorizedError } = require('../errors/errors');
const { checkToken } = require('../utils/token');

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;
  const newErr = new UnauthorizedError('login error');

  // убеждаемся, что токен присутсвует
  if (!token) {
    next(newErr);
    return;
  }

  // проверяем
  try {
    const payload = await checkToken(token);
    req.user = { _id: payload._id };
  } catch (err) {
    next(newErr);
  }
  next(); // пропускаем запрос дальше
};
