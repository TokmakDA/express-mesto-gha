const { checkToken } = require('../utils/token');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  // убеждаемся, что токен присутсвует
  if (!token) {
    console.log('auth => нет куки');
    return res.status(401).send({ message: 'Unauthorized Error' });
  }

  // проверяем
  const payload = checkToken(token);

  if (!payload) {
    console.log('payload => куки не прошел проверку');
    return res.status(401).send({ message: 'Unauthorized Error' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
