module.exports = function isSignedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // Proceed if user is signed in
  }
  console.log("User not signed in, redirecting to sign-in page");
  res.redirect("/auth/sign-in"); // Redirect if not signed in
};
