const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("./models/recipe"); // Ensure Recipe model is properly imported
const recipesController = require("./controllers/recipes");

const app = express();
dotenv.config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// View Engine
app.set("view engine", "ejs");

// Routes
// Homepage Route
app.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find(); // Fetch all recipes from the database
    res.render("index", { recipes }); // Pass the recipes to the view
  } catch (error) {
    console.error("Error fetching homepage recipes:", error);
    res.status(500).send("Error loading homepage.");
  }
});

// About Route
app.get("/about", (req, res) => {
  res.render("about"); // Ensure views/about.ejs exists
});


app.use("/recipes", recipesController);

// 404 Error
app.use((req, res) => {
  res.status(404).render("404");
});

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
