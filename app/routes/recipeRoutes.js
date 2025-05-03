const express = require("express");
const router = express.Router();

const imageUploader = require("../middlewares/imageUploader.js");
const recipesController = require("../controllers/recipesController.js");

router.get("/", recipesController.getAllRecipes);

router.get("/:id", recipesController.getRecipeById);

router.post(
  "/",
  (req, res, next) => {
    imageUploader.single("coverImage")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  recipesController.createRecipe,
);

router.put(
  "/:id",
  (req, res, next) => {
    imageUploader.single("coverImage")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  recipesController.updateRecipe,
);

router.delete("/:id", recipesController.deleteRecipe);

module.exports = router;
