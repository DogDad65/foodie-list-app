// middleware/isSignedIn.js

const isSignedIn = (req, res, next) => {
  if (req.session.user) {
    return next(); // Proceed if the user is signed in
  }
  res.redirect("/auth/sign-in"); // Redirect to sign-in if not logged in
};

module.exports = isSignedIn;
