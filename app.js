const express = require('express');

const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { handleError } = require('./errors/errors');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb').catch((err) => {
  console.log(err);
});

app.use(cookieParser());
app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', auth, require('./routes'));
app.use((err, req, res, next) => {
  handleError(err, req, res);
});

app.listen(PORT, () => {
  console.log(`Start server, port:${PORT}`);
});
