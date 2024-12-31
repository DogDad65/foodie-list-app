const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Recipe = require("./models/recipe");
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

// Set View Engine
app.set("view engine", "ejs");

// Middleware to Pass User to Views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render("index", { recipes });
  } catch (error) {
    console.error("Error fetching homepage recipes:", error);
    res.status(500).send("Error loading homepage.");
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.use("/recipes", recipesController);

// 404 Handler
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
