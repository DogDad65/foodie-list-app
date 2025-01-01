const express = require("express");
const bcrypt = require("bcrypt"); // Ensure passwords are securely hashed
const User = require("../models/user");
const router = express.Router();

// Route to render the login page
router.get("/login", (req, res) => {
  res.render("auth/sign-in");
});

// Route to handle login submission
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("Invalid username or password.");
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid username or password.");
    }

    // Save user session
    req.session.user = user;

    // Redirect based on admin status
    if (user.isAdmin) {
      return res.redirect("/recipes/new"); // Redirect admin to new recipe form
    }
    res.redirect("/"); // Redirect regular users to homepage
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("An error occurred during login.");
  }
});

// Route to handle logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/"); // Redirect to homepage after logout
  });
});

module.exports = router;
