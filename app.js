const express = require('express');

const mongoose = require('mongoose');
const { ERROR_NOT_FOUND } = require('./errors/errors');

const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb').catch((err) => {
  console.log(err);
});

app.use(cookieParser());
app.use(express.json());

app.use(auth, require('./routes'));

app.post('/signin', login);
app.post('/signup', createUser);

app.listen(PORT, () => {
  console.log(`Start server, port:${PORT}`);
});

app.get('/posts', (req, res) => {
  console.log(req.cookies.jwt); // достаём токен
});
