const express = require('express');

const mongoose = require('mongoose');
const { userRouter, cardRouter } = require('./routes');
const { ERROR_NOT_FOUND } = require('./errors/errors');

const validator = require('validator');
const cookieParser = require('cookie-parser');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb').catch((err) => {
  console.log(err);
});

app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    // вставьте сюда _id созданного в предыдущем пункте пользователя
    _id: '646336e72c4fa3a85a65f5cc',
  };
  next();
});
app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Start server, port:${PORT}`);
});
