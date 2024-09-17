const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods');
const isSignedIn = require('./middleware/is-signed-in'); // Import the middleware

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);


mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev')); // Optional for logging requests
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Route for homepage
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

// Route for VIP lounge (only accessible if signed in)
app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party, ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});

// Auth controller
app.use('/auth', authController);

// Foods controller with authentication check
app.use('/users/:userId/foods', isSignedIn, foodsController);

// Start the server
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
