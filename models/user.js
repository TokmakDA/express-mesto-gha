const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques-Yves Cousteau',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Ocean explorer',
  },
  avatar: {
    type: String,
    required: false,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Invalid Email');
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  console.log('findUserByCredentials =>');
  return this.findOne({ email })
    .select('+password') // this — это модель User
    .then((user) => {
      console.log('findUserByCredentials => findOne =>');
      // не нашёлся — отклоняем промис
      if (!user) {
        console.log(
          'findUserByCredentials => findOne => user не нашёлся — отклоняем промис',
        );
        return Promise.reject(new Error('Incorrect email or password'));
      }
      // нашёлся — сравниваем хеши
      console.log(
        'findUserByCredentials => findOne => user нашёлся — сравниваем хеши',
      );
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          console.log(
            'findUserByCredentials => findOne => bcrypt.compare => matched =',
            matched,
          );
          return Promise.reject(new Error('Incorrect email or password'));
        }
        console.log(
          'findUserByCredentials => findOne => bcrypt.compare => matched =',
          matched,
        );
        return user; // вернем user
      });
    });
};

module.exports = mongoose.model('user', userSchema);
