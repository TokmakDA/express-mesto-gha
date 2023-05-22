const { UnauthorizedError } = require('../errors/errors');
const { checkToken } = require('../utils/token');

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;
  const err = new UnauthorizedError('Unauthorized Error');

  // убеждаемся, что токен присутсвует
  if (!token) {
    next(err);
    return;
  }

  // проверяем
  try {
    const payload = await checkToken(token);
    req.user = { _id: payload._id };
  } catch (e) {
    next(err);
  }
  next(); // пропускаем запрос дальше
};
