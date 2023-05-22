const express = require('express');

const process = require('process');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
// const { login, createUser } = require('./controllers/users');
// const auth = require('./middlewares/auth');
const { handleError } = require('./errors/errors');
// const { userSchema, userSchemaLogin } = require('./utils/validationSchemes');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb').catch((err) => {
  console.log(err);
});

app.use(cookieParser());
app.use(express.json());
app.use('/', routes);
app.use(errors());
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
  next();
});

app.listen(PORT, () => {
  console.log(`Start server, port:${PORT}`);
});
