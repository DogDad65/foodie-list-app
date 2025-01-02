const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("./models/recipe");
const recipesController = require("./controllers/recipes");
const authRoutes = require("./controllers/auth");
const adminRoutes = require("./controllers/admin");

const app = express();
dotenv.config();

// Middleware for parsing request body and serving static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to make user globally available
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null; // Safely access req.session.user
  next();
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set View Engine
app.set("view engine", "ejs");

// Routes
// Homepage Route
app.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render("index", { recipes });
  } catch (error) {
    console.error("Error fetching homepage recipes:", error);
    res.status(500).send("Error loading homepage.");
  }
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Authentication Routes
app.use("/auth", authRoutes);

// Admin Dashboard Routes
app.use("/", adminRoutes);

// Recipes Routes
app.use("/recipes", recipesController);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render("404");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
