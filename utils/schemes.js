const { celebrate, Joi } = require('celebrate');

const userSchema = {
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).strip().required(),
};

const cardSchema = {
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().required(),
};

celebrate({
  body: Joi.object()
    .keys({
      name: userSchema.name,
      about: userSchema.about,
      avatar: userSchema.avatar,
    })
    .unknown(true),
});

celebrate({
  body: Joi.object().keys({ userSchema }).unknown(true),
});

module.exports = {
  userSchema,
  cardSchema,
};
