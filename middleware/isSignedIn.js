// middleware/isSignedIn.js
module.exports = (req, res, next) => {
  if (!req.session.user) {
    console.log('User not signed in, redirecting to sign-in page');
    return res.redirect('/auth/sign-in'); // Redirect to sign-in if no user in session
  }
  next();
};


  