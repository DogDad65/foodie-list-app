const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const { isAdmin, isAuthenticated } = require("../middleware/auth");

// Admin dashboard route
router.get("/admin", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render("admin/dashboard", { recipes }); // Ensure this view exists
  } catch (error) {
    console.error("Error loading admin dashboard:", error);
    res.status(500).send("Error loading admin dashboard.");
  }
});

module.exports = router;
