// server.js
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");


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

const Recipe = require("./models/recipe");

app.get("/community", isSignedIn, async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("userId", "realName username");
    res.render("recipes/community", { recipes, user: req.session.user });
  } catch (error) {
    console.error("Error loading community page:", error);
    res.status(500).send("Error loading community page.");
  }
});

app.get("/about", (req, res) => {
  res.render("about", { user: req.session.user || null });
});

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

// Register routes
app.use("/auth", authController);
app.use("/users/:userId/recipes", isSignedIn, recipesController);
app.use("/users/:userId/shopping-list", isSignedIn, shoppingListController);
app.use("/community", recipesController); // Ensure this registration is correct

// Home route
app.get("/", (req, res) => {
  res.render("index");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
