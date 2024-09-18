const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import controllers
const authController = require('./controllers/auth');
const shoppingListController = require('./controllers/shopping-list');
const recipesController = require('./controllers/recipes');
const usersController = require('./controllers/users');
const isSignedIn = require('./middleware/is-signed-in');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static('public'));

// Middleware to pass user data to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Set `user` to `null` if not logged in
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Set view engine
app.set('view engine', 'ejs');

// Routes
app.use('/auth', authController);
app.use('/users', usersController);
app.use('/users/:userId/shopping-list', isSignedIn, shoppingListController);
app.use('/users/:userId/recipes', isSignedIn, recipesController);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Error handling middleware (make sure this is at the end)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Only one instance of `app.listen()`
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
