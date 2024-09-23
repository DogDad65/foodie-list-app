// controllers/shopping-list.js
const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList');
const isSignedIn = require('../middleware/isSignedIn');

// Fetch shopping list items for the logged-in user
router.get('/', isSignedIn, async (req, res) => {
  try {
    // Fetch items by user ID to ensure the correct data is pulled
    const userId = req.session.user._id; // Ensure user ID is correct
    console.log('Fetching shopping list for User ID:', userId);  // Debugging log
    const shoppingList = await ShoppingList.find({ userId: userId });
    console.log('Fetched shopping list items:', shoppingList); // Check fetched items
    res.render('shopping-list', { shoppingList, user: req.session.user });
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    res.redirect('/auth/dashboard');
  }
});


module.exports = router;
