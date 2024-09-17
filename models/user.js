const mongoose = require('mongoose');

// Define the food schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  expirationDate: { type: Date }
});

// Define the user schema with an embedded pantry (array of foods)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  pantry: [foodSchema] // Embed foodSchema here
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
