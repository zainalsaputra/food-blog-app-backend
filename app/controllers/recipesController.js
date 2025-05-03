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
}

module.exports = recipesController;
