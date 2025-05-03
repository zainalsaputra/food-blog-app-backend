const createError = require('http-errors');
const { createRecipeValidation } = require("../validations/recipesValidations");
const Recipe = require("../models/recipesModel");

class recipesController {
  static async getAllRecipes(req, res) {
    try {
      // Simulate fetching recipes from a database
      const recipes = [
        { id: 1, name: "Spaghetti Bolognese" },
        { id: 2, name: "Chicken Curry" },
      ];
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recipes" });
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

      const newRecipe = await Recipe({
        title,
        ingredients,
        instructions,
        cookingTime,
        coverImage,
      });

      // if (!newRecipe) {
      //   return next(createError(400, "Failed to create recipe"));
      // }

      res.status(201).json({
        message: "Recipe created successfully!",
        recipe: newRecipe,
      });
      
    } catch (error) {
     next(error);
    }
  }
}

module.exports = recipesController;
