const User = require("../models/User");

module.exports = function requireRole(role) {
  return async function (req, res, next) {
    const clerkUserId = req.auth.userId;

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: `Access denied. ${role} role required.`,
      });
    }

    req.user = user; // attach user for next handlers
    next();
  };
};
