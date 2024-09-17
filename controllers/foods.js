// controllers/foods.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Index route to display all pantry items
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('foods/index', { pantry: user.pantry });
  } catch (err) {
    res.status(500).send(err);
  }
});

// New food item form
router.get('/new', (req, res) => {
  res.render('foods/new');
});

// Create a new food item
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    user.pantry.push(req.body);
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Edit food item form
router.get('/:foodId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const food = user.pantry.id(req.params.foodId);
    res.render('foods/edit', { food });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a food item
router.put('/:foodId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const food = user.pantry.id(req.params.foodId);
    food.set(req.body);
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a food item
router.delete('/:foodId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    user.pantry.id(req.params.foodId).remove();
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
