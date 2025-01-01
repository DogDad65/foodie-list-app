const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Recipe = require("../models/recipe");
const { isAdmin, isAuthenticated } = require("../middleware/auth");

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Save images to 'public/uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Route to render the "New Recipe" form
router.get("/new", isAuthenticated, isAdmin, (req, res) => {
  res.render("recipes/new"); // Ensure recipes/new.ejs exists
});

// Route to create a new recipe
router.post("/", isAuthenticated, isAdmin, upload.single("image"), async (req, res) => {
  const { title, ingredients, instructions } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null; // Use uploaded image or null

  // Validate required fields
  if (!title || !ingredients || !instructions) {
    return res.status(400).send("All fields are required.");
  }

  try {
    // Create a new recipe associated with the logged-in user
    const newRecipe = new Recipe({
      title,
      ingredients: ingredients.split("\n").map((item) => item.trim()), // Split ingredients by newlines
      instructions,
      image,
      userId: req.session.user ? req.session.user._id : null, // Associate with logged-in user
    });
    await newRecipe.save();
    res.redirect("/recipes"); // Redirect to recipes list after creation
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).send("Error saving recipe.");
  }
});

// Route to list all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find(); // Fetch all recipes
    res.render("recipes/index", { recipes }); // Ensure recipes/index.ejs exists
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).send("Error loading recipes.");
  }
});

// Route to fetch and display a single recipe
router.get("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).send("Invalid recipe ID format.");
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).send("Recipe not found.");
    }
    res.render("recipes/show", { recipe, user: req.session.user }); // Pass user info for edit/delete buttons
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).send("Error loading recipe.");
  }
});

// Route to render the "Edit Recipe" form
router.get("/:recipeId/edit", isAdmin, async (req, res) => {
  const { recipeId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).send("Invalid recipe ID format.");
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).send("Recipe not found.");
    }
    res.render("recipes/edit", { recipe }); // Ensure recipes/edit.ejs exists
  } catch (error) {
    console.error("Error loading edit form:", error);
    res.status(500).send("Error loading recipe for editing.");
  }
});

// Route to update a recipe
router.put("/:recipeId", isAdmin, upload.single("image"), async (req, res) => {
  const { recipeId } = req.params;
  const { title, ingredients, instructions } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.existingImage; // Use uploaded image or existing one

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).send("Invalid recipe ID format.");
  }

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      {
        title,
        ingredients: ingredients.split("\n").map((item) => item.trim()), // Split ingredients by newlines
        instructions,
        image,
      },
      { new: true } // Return the updated document
    );
    res.redirect(`/recipes/${updatedRecipe._id}`); // Redirect to updated recipe page
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).send("Error updating recipe.");
  }
});

// Route to delete a recipe
router.delete("/:recipeId", isAdmin, async (req, res) => {
  const { recipeId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).send("Invalid recipe ID format.");
  }

  try {
    await Recipe.findByIdAndDelete(recipeId); // Delete recipe by ID
    res.redirect("/recipes"); // Redirect to recipes list after deletion
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).send("Error deleting recipe.");
  }
});

module.exports = router;
