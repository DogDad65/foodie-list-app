const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [String],
  instructions: String,
  userId: mongoose.Schema.Types.ObjectId, // Optional: Reference to the user
  image: String, // Optional: URL to the recipe image
});

module.exports = mongoose.model("Recipe", recipeSchema);
