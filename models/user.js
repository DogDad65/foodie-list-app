const mongoose = require("mongoose");

// Define the food schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchased: { type: Boolean, default: false }, // New field for purchased status
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  // image: { type: String }, // Add an optional image URL field
  createdAt: { type: Date, default: Date.now },
});


// Define the user schema with an embedded pantry and recipes
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  pantry: [foodSchema], // Embed foodSchema for pantry items
  recipes: [recipeSchema], // Embed recipeSchema for recipes
});

const User = mongoose.model("User", userSchema);
module.exports = User;
