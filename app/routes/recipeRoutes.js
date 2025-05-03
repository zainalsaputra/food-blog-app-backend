const express = require("express");
const router = express.Router();

const recipesController = require("../controllers/recipesController.js");

router.get("/", recipesController.getAllRecipes);

router.get("/:id", (req, res) => {
  const recipeId = req.params.id;
  res.send(`Recipe ID: ${recipeId}`);
});

router.post("/", recipesController.createRecipe);

router.put("/:id", (req, res) => {
  const recipeId = req.params.id;
  const updatedRecipe = req.body;
  res.json({
    message: `Recipe ID: ${recipeId} updated successfully!`,
    recipe: updatedRecipe,
  });
});

router.delete("/:id", (req, res) => {
  const recipeId = req.params.id;
  res.json({
    message: `Recipe ID: ${recipeId} deleted successfully!`,
  });
});

module.exports = router;
