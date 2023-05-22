const { celebrate, Joi } = require('celebrate');

const userSchema = {
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().regex(/(https?:\/\/)\w+?(\S+|W+)?(\w+)?.\w{2,15}\/?/),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
};

const cardSchema = {
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string()
    .required()
    .regex(/(https?:\/\/)\w+?(\S+|W+)?(\w+)?.\w{2,15}\/?/),
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
