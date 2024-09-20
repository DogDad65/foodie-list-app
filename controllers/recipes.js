// controllers/recipes.js
const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const User = require('../models/user');
const ShoppingItem = require('../models/shoppingList');
const isSignedIn = require('../middleware/isSignedIn');

// New recipe form
router.get('/new', isSignedIn, (req, res) => {
  res.render('recipes/new', { user: req.session.user });
});

// Community page route
router.get('/community', async (req, res) => {
  try {
  
    const recipes = await Recipe.find().populate('userId', 'realName username'); 

    res.render('recipes/community', { recipes });
  } catch (error) {
    console.error('Error loading community page:', error);
    res.status(500).send('Error loading community page.');
  }
});

// Show recipe
router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    res.render('recipes/show', { recipe, user: req.session.user });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.redirect('/auth/dashboard');
  }
});

// Edit recipe form
router.get('/:recipeId/edit', isSignedIn, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    res.render('recipes/edit', { recipe, user: req.session.user });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.redirect('/auth/dashboard');
  }
});


// Update recipe
router.put('/:recipeId', async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      title,
      ingredients: ingredients.split(',').map(item => item.trim()),
      instructions
    });
    res.redirect(`/users/${req.session.user._id}/recipes/${req.params.recipeId}`);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.redirect('/auth/dashboard');
  }
});


// Create recipe with shopping list addition
router.post('/', isSignedIn, async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const ingredientArray = ingredients.split(',').map(item => item.trim());
    const recipe = await Recipe.create({
      title,
      ingredients: ingredientArray,
      instructions,
      userId: req.session.user._id
    });

    // Add each ingredient to the shopping list
    await Promise.all(
      ingredientArray.map(async ingredient => {
        await ShoppingItem.create({ name: ingredient, userId: req.session.user._id });
      })
    );

    await User.findByIdAndUpdate(req.session.user._id, { $push: { recipes: recipe._id } });
    res.redirect('/auth/dashboard');
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.redirect('/recipes/new');
  }
});

// Delete a recipe
router.delete('/:recipeId', isSignedIn, async (req, res) => {
  try {
    // Find and delete the recipe
    const recipe = await Recipe.findByIdAndDelete(req.params.recipeId);

    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }

    // Remove the recipe reference from the user
    await User.findByIdAndUpdate(req.session.user._id, { $pull: { recipes: req.params.recipeId } });

    // Redirect back to the dashboard or wherever appropriate
    res.redirect('/auth/dashboard');
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.redirect('/auth/dashboard');
  }
});

module.exports = router;

