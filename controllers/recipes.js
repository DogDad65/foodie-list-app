// controllers/recipes.js
const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const User = require("../models/user");
const ShoppingList = require("../models/shoppingList");
const isSignedIn = require("../middleware/isSignedIn");
const multer = require('multer');
const upload = multer();

// Fetch shopping list items for the logged-in user
router.get('/', isSignedIn, async (req, res) => {
  try {
    const userId = req.session.user._id; 
    console.log('Fetching shopping list for User ID:', userId);  
    const shoppingList = await ShoppingList.find({ userId: userId }); // Fetch items by user ID
    console.log('Fetched shopping list items:', shoppingList); // Check fetched items
    res.render('shopping-list', { shoppingList, user: req.session.user });
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    res.redirect('/auth/dashboard');
  }
});

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

// Edit recipe form route
router.get("/:recipeId/edit", isSignedIn, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).send("Recipe not found.");
    }
    res.render("recipes/edit", { recipe, user: req.session.user });
  } catch (error) {
    console.error("Error loading edit form:", error);
    res.redirect("/auth/dashboard");
  }
});


// Update recipe route
router.put("/:recipeId", isSignedIn, async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;

    // Split ingredients into an array
    const ingredientArray = ingredients ? ingredients.split('\n').map((item) => item.trim()) : [];

    // Find and update the recipe
    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      title,
      ingredients: ingredientArray,
      instructions,
    }, { new: true }); // Ensure this option returns the updated document

    // Redirect back to the show page after updating
    res.redirect(`/users/${req.session.user._id}/recipes/${req.params.recipeId}`);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.redirect("/auth/dashboard");
  }
});


// Create recipe with shopping list addition
router.post('/', isSignedIn, upload.none(), async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;

    if (!title || !instructions) {
      console.error("Missing required fields: title or instructions");
      return res.status(400).send("Title and instructions are required.");
    }

    const userId = req.session.user._id; 
    console.log('Logged-in User ID during creation:', userId); 

    const ingredientArray = ingredients ? ingredients.split('\n').map(item => item.trim()).filter(item => item) : [];

    const recipe = await Recipe.create({
      title,
      ingredients: ingredientArray,
      instructions,
      userId: userId,
    });

    await Promise.all(
      ingredientArray.map(async (ingredient) => {
        console.log('Creating shopping list item for:', ingredient);
        console.log('User ID during item creation:', userId);

        await ShoppingList.create({
          name: ingredient,
          quantity: 1,
          purchased: false,
          userId: userId,
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
