const fs = require("fs");
const path = require("path");
const createError = require("http-errors");
const {
  createRecipeValidation,
  updateRecipeValidation,
  getRecipeByIdValidation,
} = require("../validations/recipesValidations");

class RecipesController {

  constructor(recipeService) {
    this.recipeService = recipeService;
  }

  async getAllRecipes(req, res) {
    try {
      const recipes = await this.recipeService.find();
      if (!recipes) {
        return next(createError(404, "No recipes found"));
      }
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  }

  async createRecipe(req, res, next) {
    try {
      if (typeof req.body.ingredients === "string") {
        try {
          req.body.ingredients = JSON.parse(req.body.ingredients);
        } catch (parseErr) {
          return next(createError(400, '"ingredients" must be a valid array'));
        }
      }
      const { error } = createRecipeValidation.validate(req.body);
      if (error) {
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        }
        return next(createError(400, error.details[0].message));
      }
      if (error) {
        return next(createError(400, error.details[0].message));
      }
      const { title, ingredients, instructions, cookingTime } = req.body;
      const coverImage = req.file?.filename || null;
      const newRecipe = await this.recipeService.create({
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
        status: "success",
        message: "Recipe created successfully!",
        recipe: newRecipe,
      });
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
      next(error);
    }
  }

  async getRecipeById(req, res, next) {
    try {
      const recipeId = req.params.id;
      const { error } = getRecipeByIdValidation.validate(req.params);
      if (error) {
        return next(createError(400, error.details[0].message));
      }
      const recipe = await this.recipeService.findById(recipeId);
      if (!recipe) {
        return next(createError(404, "Recipe not found"));
      }
      res.status(200).json(recipe);
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
      next(error);
    }
  }

  async updateRecipe(req, res, next) {
    try {
      if (typeof req.body.ingredients === "string") {
        try {
          req.body.ingredients = JSON.parse(req.body.ingredients);
        } catch (parseErr) {
          return next(createError(400, '"ingredients" must be a valid array'));
        }
      }

      const recipeId = req.params.id;

      const { error } = updateRecipeValidation.validate({
        id: recipeId,
        ...req.body,
      });
      if (error) {
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        }
        return next(createError(400, error.details[0].message));
      }

      const updateData = {
        ...req.body,
      };

      const existingRecipe = await this.recipeService.findById(recipeId);
      if (!existingRecipe) {
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        }
        return next(createError(404, "Recipe not found"));
      }

      if (req.file) {
        updateData.coverImage = req.file.filename;

        if (existingRecipe.coverImage) {
          const oldImagePath = path.join(
            __dirname,
            "../../uploads",
            existingRecipe.coverImage,
          );
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }
      }

      const updatedRecipe = await this.recipeService.findByIdAndUpdate(
        recipeId,
        updateData,
        {
          new: true,
          runValidators: true,
        },
      );

      res.status(200).json({
        status: "success",
        message: "Recipe updated successfully!",
        recipe: updatedRecipe,
      });
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
      next(error);
    }
  }

  async deleteRecipe(req, res, next) {
    try {
      const recipeId = req.params.id;

      const { error } = getRecipeByIdValidation.validate({ id: recipeId });
      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const existingRecipe = await this.recipeService.findById(recipeId);
      if (!existingRecipe) {
        return next(createError(404, "Recipe not found"));
      }

      if (existingRecipe.coverImage) {
        const imagePath = path.join(
          __dirname,
          "../../uploads",
          existingRecipe.coverImage,
        );
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(imagePath, (err) => {
              if (err) console.error("Gagal hapus gambar:", err);
            });
          } else {
            console.warn("Gambar tidak ditemukan saat penghapusan:", imagePath);
          }
        });
      }

      await this.recipeService.findByIdAndDelete(recipeId);

      res.status(200).json({
        status: "success",
        message: "Recipe deleted successfully!",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RecipesController;
