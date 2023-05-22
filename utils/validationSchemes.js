const { Joi } = require('celebrate');

const userConfig = {
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().regex(/(https?:\/\/)\w+?(\S+|W+)?(\w+)?.\w{2,15}\/?/),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
};

const userSchema = {
  body: Joi.object().keys(userConfig),
};

const userSchemaLogin = {
  body: Joi.object().keys({
    email: userConfig.email,
    password: userConfig.password,
  }),
};

const userSchemaUpdate = {
  body: Joi.object().keys({
    name: userConfig.name,
    about: userConfig.about,
    avatar: userConfig.avatar,
  }),
};

const userIdSchema = {
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
};

const cardSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .required()
      .regex(/(https?:\/\/)\w+?(\S+|W+)?(\w+)?.\w{2,15}\/?/),
  }),
};

const cardIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
};

module.exports = {
  userSchema,
  userSchemaLogin,
  userSchemaUpdate,
  userIdSchema,
  cardSchema,
  cardIdSchema,
};
