const express = require("express");
const router = express.Router();

const bindControllerMethods = require("../utils/bindControllerMethods.js");
const imageUploadMiddleware = require("../middlewares/imageUploader.js");
const RecipesController = require("../controllers/recipesController.js");
const recipeSchema = require("../models/recipesModel");

const recipeController = bindControllerMethods(new RecipesController(recipeSchema));


router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);
router.post("/", imageUploadMiddleware, recipeController.createRecipe);
router.put("/:id", imageUploadMiddleware, recipeController.updateRecipe);
router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;
