const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Recipe = require("../models/recipe");

// Route to list all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render("recipes/index", { recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).send("Error loading recipes.");
  }
});

// Route to fetch and display a single recipe
router.get("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).send("Invalid recipe ID format.");
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).send("Recipe not found.");
    }
    res.render("recipes/show", { recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).send("Error loading recipe.");
  }
});

module.exports = router;
