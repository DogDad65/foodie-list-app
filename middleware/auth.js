// middleware/auth.js
// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // User is authenticated, proceed
  }
  res.redirect("/login"); // Redirect to login if not authenticated
}

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next(); // User is an admin, proceed
  }
  res.status(403).send("Access Denied"); // Send error if not an admin
}

module.exports = {
  isAuthenticated,
  isAdmin,
};

