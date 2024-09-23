// models/recipe.js

const mongoose = require("mongoose");
const { Schema } = mongoose; // Correctly import Schema from Mongoose

// Define the Recipe schema
const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String], // Array of strings for ingredients
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId, // Reference to the User model
    ref: "User",
    required: true,
  },
});

// Create and export the Recipe model
const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
