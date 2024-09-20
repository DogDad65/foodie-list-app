const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingList');
const isSignedIn = require('../middleware/isSignedIn');


router.get('/', isSignedIn, async (req, res) => {
  try {
    // Fetch shopping list items for the specific user
    const shoppingList = await ShoppingList.find({ userId: req.session.user._id });

    // Log the fetched items to verify data
    console.log('Fetched shopping list items:', shoppingList);

    // Render the shopping list page with fetched data
    res.render('shopping-list', { shoppingList, user: req.session.user });
  } catch (error) {
    console.error('Error loading shopping list:', error);
    res.status(500).send('Error loading shopping list.');
  }
});

// Route to handle user registration
router.post('/update', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Create and save the new user
    const newUser = new User({ username, password });
    await newUser.save();

    // Log the user in after successful registration
    req.session.user = newUser;
    res.redirect('/auth/dashboard'); // Redirect to user dashboard or desired page
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user.');
  }
});

module.exports = router;
