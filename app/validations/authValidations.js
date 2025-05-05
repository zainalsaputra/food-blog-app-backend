const Joi = require("joi");

registerValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  //   confirmPassword: Joi.string()
  //     .valid(Joi.ref("password"))
  //     .required()
  //     .messages({ "any.only": "Passwords do not match" }),
});

loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
});

module.exports = {
  registerValidation,
  loginValidation,
};
