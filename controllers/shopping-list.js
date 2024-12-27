// controllers/shopping-list.js
const express = require("express");
const router = express.Router();
//const Ingredient = require("../models/ingredient");
const ShoppingList = require("../models/shoppingList");
const isSignedIn = require("../middleware/isSignedIn");

// Fetch shopping list items for the logged-in user
router.get("/", isSignedIn, async (req, res) => {
  try {
    const userId = req.session.user._id; // User's ID
    const shoppingList = await ShoppingList.find({ userId: userId, purchased: false }); // Fetch active items
    res.render("shopping-list", { shoppingList, userId }); // Pass shoppingList to the template
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    res.redirect("/auth/dashboard");
  }
});

// Route to toggle the purchased status of a shopping list item
router.post("/:itemId/toggle", async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find the item in the shopping list by its ID
    const item = await ShoppingList.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Shopping list item not found" });
    }

    // Toggle the purchased status
    item.purchased = !item.purchased;
    await item.save(); // Ensure the item is saved in the database

    console.log(`Item updated: ${item.name}, Purchased: ${item.purchased}`); // Debugging log

    res.json({ success: true, item });
  } catch (error) {
    console.error("Error toggling shopping list item status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
