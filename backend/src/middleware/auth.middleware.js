const { requireAuth } = require("@clerk/express");

module.exports = requireAuth({
  unauthorizedHandler: (req, res) => {
    return res.status(401).json({
      error: "Unauthorized",
    });
  },
});
