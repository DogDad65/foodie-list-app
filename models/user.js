// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  realName: String,
  password: { type: String, required: true },
  shoppingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingItem' }] // Reference to ShoppingItem
});

module.exports = mongoose.model('User', userSchema);
