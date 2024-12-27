// models/recipe.js

const mongoose = require("mongoose");
const { Schema } = mongoose; // Correctly import Schema from Mongoose

// Define the Recipe schema
const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  prepTime: { type: Number }, // In minutes
  bakingTemp: { type: Number }, // In Fahrenheit or Celsius
  category: { type: String }, // E.g., "Cake", "Cookies", "Bread"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional
});


// Create and export the Recipe model
const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
