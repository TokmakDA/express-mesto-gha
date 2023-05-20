const { celebrate, Joi, Segments, errors } = require('celebrate');

const { celebrate, Joi } = require('celebrate');

const userSchema = {
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8).strip(),
};

const { name, about, avatar, email, password } = userSchema;

module.exports = { userSchema };

celebrate({
  body: Joi.object().keys({ userSchema }).unknown(true),
});

celebrate({ body: Joi.object().keys({ avatar }).unknown(true) });
celebrate({ body: Joi.object().keys({ name, about }).unknown(true) });
