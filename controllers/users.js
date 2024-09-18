const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model

// Route to display all users and their recipes
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('recipes'); // Assuming 'recipes' is embedded in the User schema
    res.render('users/index.ejs', { users });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
