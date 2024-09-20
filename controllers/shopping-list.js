const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList'); // Corrected import statement

console.log('Resolved path:', require.resolve('../models/shoppingList'));

// Route to display the shopping list
router.get('/', async (req, res) => {
  try {
    // Fetch the shopping list items from the database
    const shoppingList = await ShoppingList.find({ userId: req.session.user._id });
    const ingredients = shoppingList.map(item => item.name); 
    res.render('shopping-list', { shoppingList, ingredients, user: req.session.user });
  } catch (error) {
    console.error('Error loading shopping list:', error);
    res.status(500).send('Error loading shopping list.');
  }
});

// Route to handle updating the shopping list
router.post('/update', async (req, res) => {
  const purchasedItems = req.body.purchasedItems || [];
  res.redirect(`/users/${req.session.user._id}/shopping-list`);
});

module.exports = router;
