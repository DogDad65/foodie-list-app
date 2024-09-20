// controllers/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const isSignedIn = require("../middleware/isSignedIn");

// Sign-up page route
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up");
});

// Sign-in page route
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in");
});

// Dashboard route
router.get("/dashboard", isSignedIn, async (req, res) => {
  try {
    const user = req.session.user;
    if (!user || !user._id) {
      return res.status(400).send("User not found in session.");
    }

    // Fetch user's recipes
    const recipes = await Recipe.find({ userId: user._id });
    res.render("dashboard", { user, recipes });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.redirect("/");
  }
});

// Sign-out route
router.get("/sign-out", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during sign-out:", err);
      return res.status(500).send("Error signing out.");
    }
    res.redirect("/");
  });
});

// Sign-up route
router.post("/sign-up", async (req, res) => {
  try {
    const { realName, username, password, confirmPassword } = req.body;

    // Trim inputs for consistency
    const trimmedRealName = realName.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Check if passwords match
    if (trimmedPassword !== trimmedConfirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    // Create and save the new user
    const newUser = new User({
      realName: trimmedRealName,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Set the user in the session
    req.session.user = {
      _id: newUser._id,
      username: newUser.username,
      realName: newUser.realName,
    };

    res.redirect("/auth/dashboard");
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).send("Error creating user.");
  }
});

// Sign-in route
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const trimmedPassword = password.trim();

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("Login failed. Please check your credentials.");
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    if (!isMatch) {
      return res.status(400).send("Login failed. Please check your credentials.");
    }

    // Set the session user after successful login
    req.session.user = {
      _id: user._id,
      realName: user.realName,
      username: user.username,
    };

    res.redirect("/auth/dashboard");
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.redirect("/auth/sign-in");
  }
});

// Delete user account route
router.delete("/delete", isSignedIn, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.session.user._id);
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Error deleting account. Please try again.");
      }
      res.redirect("/");
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting account.");
  }
});

module.exports = router;
