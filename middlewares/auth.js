const { UnauthorizedError } = require('../errors/errors');
const { checkToken } = require('../utils/token');

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;
  const err = new UnauthorizedError('Unauthorized Error');

  console.log('auth => ');
  req.user = { _id: '64676a42271b2c7ee35e7c01' }; // для проверка ошибок

  // // убеждаемся, что токен присутсвует
  // if (!token) {
  //   console.log('auth => нет куки');
  //   next(err);
  //   return;
  // }

  // // проверяем
  // try {
  //   const payload = await checkToken(token);
  //   req.user = { _id: payload._id };
  // } catch {
  //   console.log('payload => куки не прошел проверку');
  //   next(err);
  // }
  next(); // пропускаем запрос дальше
};
