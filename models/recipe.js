const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [String],
  instructions: { type: String, required: true },
  image: { type: String }, // URL or path to an image
  category: { type: String, default: "General" },
});

module.exports = mongoose.model("Recipe", recipeSchema);
