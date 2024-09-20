const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true }, // This is the required field causing the error
  purchased: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
