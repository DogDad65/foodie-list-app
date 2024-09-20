const express = require('express');
const router = express.Router();

// Route to display the community page
router.get('/', (req, res) => {
  try {
    // Render the community page template, ensure the file exists in the views directory
    res.render('community'); // Ensure community.ejs exists in your views folder
  } catch (error) {
    console.error('Error loading community page:', error);
    res.status(500).send('Error loading community page.');
  }
});

module.exports = router;
