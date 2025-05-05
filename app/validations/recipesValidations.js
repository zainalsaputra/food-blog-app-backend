const Joi = require("joi");

const createRecipeValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  instructions: Joi.string().min(10).required(),
  cookingTime: Joi.number().integer().min(1).required(),
  coverImage: Joi.string().uri().optional(),
});

const updateRecipeValidation = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().min(3).max(100).required(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  instructions: Joi.string().min(10).required(),
  cookingTime: Joi.number().integer().min(1).required(),
  coverImage: Joi.string().uri().optional(),
});

const getRecipeByIdValidation = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  createRecipeValidation,
  updateRecipeValidation,
  getRecipeByIdValidation,
};
