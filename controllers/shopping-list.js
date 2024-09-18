const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Index route to display all shopping list items
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render("shopping-list/index", {
      pantry: user.pantry,
      user: req.session.user,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// New food item form
router.get('/new', (req, res) => {
  res.render('shopping-list/new', { user: req.session.user });
});

// Create a new shopping list item
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    user.pantry.push(req.body);
    await user.save();
    res.redirect(`/users/${user._id}/shopping-list`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Edit food item form
router.get("/:foodId/edit", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const food = user.pantry.id(req.params.foodId);
    res.render("shopping-list/edit", { food, user: req.session.user });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to update purchased items
router.post('/mark-purchased', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    // Mark all items as not purchased initially
    user.pantry.forEach(item => {
      item.purchased = false;
    });

    // Mark the selected items as purchased
    if (req.body.purchasedItems) {
      const purchasedItems = Array.isArray(req.body.purchasedItems) ? req.body.purchasedItems : [req.body.purchasedItems];
      purchasedItems.forEach(itemId => {
        const foodItem = user.pantry.id(itemId);
        if (foodItem) {
          foodItem.purchased = true;
        }
      });
    }

    await user.save();
    res.redirect(`/users/${user._id}/shopping-list`);
  } catch (err) {
    res.status(500).send('An error occurred while updating the shopping list.');
  }
});

// Update a food item
router.put("/:foodId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const food = user.pantry.id(req.params.foodId);
    food.set(req.body);
    await user.save();
    res.redirect(`/users/${user._id}/shopping-list`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a food item
router.delete("/:foodId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.pantry.pull(req.params.foodId);
    await user.save();
    res.redirect(`/users/${user._id}/shopping-list`);
  } catch (err) {
    console.error("Error occurred while deleting the pantry item:", err);
    res.status(500).send("An error occurred while deleting the pantry item.");
  }
});

module.exports = router;
