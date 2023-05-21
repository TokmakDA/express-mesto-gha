const express = require('express');

const process = require('process');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { handleError, NotFoundError } = require('./errors/errors');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb').catch((err) => {
  console.log(err);
});

app.use(cookieParser());
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', auth, routes);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Not found'));
});
app.use((err, req, res, next) => {
  handleError(err, req, res);
  next();
});

app.listen(PORT, () => {
  console.log(`Start server, port:${PORT}`);
});
