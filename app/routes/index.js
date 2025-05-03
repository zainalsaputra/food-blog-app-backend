const express = require("express");
const router = express.Router();

const recipeRoutes = require("./recipeRoutes.js");

router.use("/recipes", recipeRoutes);

router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;
