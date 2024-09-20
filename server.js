const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authController = require('./controllers/auth');
const recipesController = require('./controllers/recipes');
const shoppingListController = require('./controllers/shopping-list');
const isSignedIn = require('./middleware/isSignedIn');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Serve static files
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');

// Middleware to pass user data to views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Register routes
app.use('/auth', authController);
app.use('/users/:userId/recipes', recipesController);
app.use('/users/:userId/shopping-list', isSignedIn, shoppingListController);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
