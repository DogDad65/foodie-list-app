// models/shoppingList.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoppingListSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  purchased: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
