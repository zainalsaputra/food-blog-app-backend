const createError = require("http-errors");
const {
  createRecipeValidation,
  updateRecipeValidation,
  getRecipeByIdValidation,
} = require("../validations/recipesValidations");
const Recipe = require("../models/recipesModel");

class recipesController {
  static async getAllRecipes(req, res) {
    try {
      const recipes = await Recipe.find();
      if (!recipes) {
        return next(createError(404, "No recipes found"));
      }
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  }

  static async createRecipe(req, res, next) {
    try {
      const { error } = createRecipeValidation.validate(req.body);
      if (error) {
        return next(createError(400, error.details[0].message));
      }
      const { title, ingredients, instructions, cookingTime, coverImage } =
        req.body;
      const newRecipe = await Recipe.create({
        title,
        ingredients,
        instructions,
        cookingTime,
        coverImage,
      });
      if (!newRecipe) {
        return next(createError(400, "Failed to create recipe"));
      }
      res.status(201).json({
        message: "Recipe created successfully!",
        recipe: newRecipe,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRecipeById(req, res, next) {
    try {
      const recipeId = req.params.id;
      const { error } = getRecipeByIdValidation.validate(req.params);
      if (error) {
        return next(createError(400, error.details[0].message));
      }
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return next(createError(404, "Recipe not found"));
      }
      res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  }

  static async updateRecipe(req, res, next) {
    try {
      const recipeId = req.params.id;
      const { error } = updateRecipeValidation.validate({
        id: recipeId,
        ...req.body,
      });
      if (error) {
        return next(createError(400, error.details[0].message));
      }
      const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedRecipe) {
        return next(createError(404, "Recipe not found"));
      }
      res.status(200).json({
        message: "Recipe updated successfully!",
        recipe: updatedRecipe,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRecipe(req, res, next) {
    try {
      const recipeId = req.params.id;
      const { error } = getRecipeByIdValidation.validate({ id: recipeId });
      if (error) {
        return next(createError(400, error.details[0].message));
      }
      const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
      if (!deletedRecipe) {
        return next(createError(404, "Recipe not found"));
      }
      res.status(200).json({
        message: "Recipe deleted successfully!",
        recipe: deletedRecipe,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = recipesController;
