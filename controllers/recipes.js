const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Index route to display logged-in user's recipes
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render("recipes/index", { recipes: user.recipes });
  } catch (err) {
    res.status(500).send(err);
  }
});

// New recipe form
router.get("/new", (req, res) => {
  res.render("recipes/new");
});

// Create a new recipe
router.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    user.recipes.push(req.body); // Add the new recipe
    await user.save();
    res.redirect(`/users/${user._id}/recipes`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Edit recipe form
router.get("/:recipeId/edit", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const recipe = user.recipes.id(req.params.recipeId);
    res.render("recipes/edit", { recipe });
  } catch (err) {
    res.status(500).send(err);
  }
});



// Update a recipe
router.put("/:recipeId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const recipe = user.recipes.id(req.params.recipeId);
    recipe.set(req.body); // Update recipe data
    await user.save();
    res.redirect(`/users/${user._id}/recipes`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a recipe
router.delete('/:recipeId', async (req, res) => {
  try {
    console.log("Attempting to delete recipe with ID:", req.params.recipeId);
    const user = await User.findById(req.session.user._id);
    
    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }

    // Use pull() to remove the recipe by ID from the user's recipes array
    user.recipes.pull(req.params.recipeId);
    await user.save(); // Save the changes to the user document
    console.log("Recipe removed successfully");

    res.redirect(`/users/${user._id}/recipes`);
  } catch (err) {
    console.error("Error occurred while deleting the recipe:", err);
    res.status(500).send("An error occurred while deleting the recipe.");
  }
});

module.exports = router;
