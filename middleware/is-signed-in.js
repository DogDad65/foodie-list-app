// middleware/is-signed-in.js

const isSignedIn = (req, res, next) => {
    // Check if the user is signed in by checking the session
    if (req.session.user) {
      return next(); // Allow the request to continue
    } else {
      // If not signed in, redirect to the sign-in page
      res.redirect('/auth/sign-in');
    }
  };
  
  module.exports = isSignedIn;
  