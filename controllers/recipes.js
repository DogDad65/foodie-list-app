// controllers/recipes.js
const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const User = require("../models/user");
const ShoppingList = require("../models/shoppingList");
const isSignedIn = require("../middleware/isSignedIn");

// New recipe form
router.get("/new", isSignedIn, (req, res) => {
  res.render("recipes/new", { user: req.session.user });
});

// Community page route - ensure this handles only `/community`
router.get("/community", isSignedIn, async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("userId", "realName username");
    res.render("recipes/community", { recipes, user: req.session.user });
  } catch (error) {
    console.error("Error loading community page:", error);
    res.status(500).send("Error loading community page.");
  }
});

// Show recipe
router.get("/:recipeId", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    res.render("recipes/show", { recipe, user: req.session.user });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.redirect("/auth/dashboard");
  }
});

// Edit recipe form
router.get("/:recipeId/edit", isSignedIn, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    res.render("recipes/edit", { recipe, user: req.session.user });
  } catch (error) {
    console.error("Error loading edit form:", error);
    res.redirect("/auth/dashboard");
  }
});

// Update recipe
router.put("/:recipeId", async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const ingredientArray = ingredients ? ingredients.split(",").map((item) => item.trim()) : [];
    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      title,
      ingredients: ingredientArray,
      instructions,
    });
    res.redirect(`/users/${req.session.user._id}/recipes/${req.params.recipeId}`);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.redirect("/auth/dashboard");
  }
});

// Create recipe with shopping list addition
router.post('/', isSignedIn, async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;

    // Check if required fields are provided
    if (!title || !instructions) {
      console.error("Missing required fields: title or instructions");
      return res.status(400).send("Title and instructions are required.");
    }

    // Ensure ingredients are defined before splitting
    const ingredientArray = ingredients ? ingredients.split('\n').map(item => item.trim()).filter(item => item) : [];

    // Create and save the new recipe
    const recipe = await Recipe.create({
      title,
      ingredients: ingredientArray,
      instructions,
      userId: req.session.user._id,
    });

    // Add each ingredient to the shopping list with default quantity of 1
    await Promise.all(
      ingredientArray.map(async ingredient => {
        
        return ShoppingList.create({
          name: ingredient,
          quantity: 1,
          purchased: false,
          userId: req.session.user._id,
        });
      })
    );

    res.redirect('/auth/dashboard');
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.redirect('/recipes/new');
  }
});

// Delete a recipe
router.delete("/:recipeId", isSignedIn, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.recipeId);

    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }

    await User.findByIdAndUpdate(req.session.user._id, {
      $pull: { recipes: req.params.recipeId },
    });

    res.redirect("/auth/dashboard");
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.redirect("/auth/dashboard");
  }
});

module.exports = router;
