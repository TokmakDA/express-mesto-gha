const { checkToken } = require('../utils/token');

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;
  const err = new Error('Unauthorized Error');
  err.statusCode = 401;

  // убеждаемся, что токен присутсвует
  if (!token) {
    console.log('auth => нет куки');
    next(err);
    return;
    // return res.status(401).send({ message: 'Unauthorized Error' });
  }

  // проверяем
  try {
    const payload = await checkToken(token);
    req.user = { _id: payload._id };
    next();
  } catch {
    console.log('payload => куки не прошел проверку');
    next(err);
    // return res.status(401).send({ message: 'Unauthorized Error' });
  }

  // req.user = { _id: payload._id }; // записываем ID из пейлоуда в объект запроса

  next(); // пропускаем запрос дальше
};
