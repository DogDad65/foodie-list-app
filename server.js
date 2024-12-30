const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("./models/recipe"); // Import Recipe model

// Import controllers
const authController = require("./controllers/auth");
const recipesController = require("./controllers/recipes");
const shoppingListController = require("./controllers/shopping-list");
const isSignedIn = require("./middleware/isSignedIn");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static("public"));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set view engine
app.set("view engine", "ejs");

// Middleware to pass user to views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Public routes (no `isSignedIn`)
app.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find(); // Fetch all recipes from the database
    res.render("index", { recipes }); // Pass recipes to the landing page
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).send("Error loading landing page");
  }
});

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find(); // Fetch all recipes
    res.render("recipes/index", { recipes }); // Render the recipes page
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).send("Error fetching recipes");
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

// Private routes (require `isSignedIn`)
app.use("/auth", authController);
app.use("/users/:userId/recipes", isSignedIn, recipesController);
app.use("/users/:userId/shopping-list", isSignedIn, shoppingListController);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
