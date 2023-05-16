const express = require('express');

const mongoose = require('mongoose');
const { userRouter, cardRouter } = require('./routes');

const app = express();
const { PORT = 3000, BASE_PATH } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

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

app.listen(PORT, () => {});
