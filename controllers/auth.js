// controllers/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Recipe = require('../models/recipe'); // Import the Recipe model
const isSignedIn = require('../middleware/isSignedIn');

// Sign-up route
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up');
});

// Sign-in route
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in');
});

// Dashboard route
router.get('/dashboard', isSignedIn, async (req, res) => {
  console.log('Dashboard route hit');
  try {
    const user = req.session.user;

    // Log the user data to inspect
    console.log('User in session:', user);

    if (!user || !user._id) {
      return res.status(400).send('User not found in session.');
    }

    // Fetch user's recipes
    const recipes = await Recipe.find({ userId: user._id });

    // Log the recipes data to inspect
    console.log('Recipes:', recipes);

    res.render('dashboard', { user, recipes });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.redirect('/');
  }
});

// Sign-out route
router.get('/sign-out', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during sign-out:', err);
      return res.status(500).send('Error signing out.');
    }
    res.redirect('/'); // Redirect to home page or sign-in page after signing out
  });
});

// Sign-in route
router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      console.error('Login failed. Invalid credentials.');
      return res.status(400).send('Login failed. Please check your credentials.');
    }

    // Set the user in the session
    req.session.user = {
      _id: user._id,
      realName: user.realName,
      username: user.username,
    };

    console.log('User set in session:', req.session.user);

    res.redirect('/auth/dashboard');
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.redirect('/auth/sign-in');
  }
});

// Delete user account route
router.delete('/delete', isSignedIn, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.session.user._id);

    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Error deleting account. Please try again.');
      }
      // Redirect to home or sign-in page after deletion
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting account.');
  }
});

module.exports = router;
