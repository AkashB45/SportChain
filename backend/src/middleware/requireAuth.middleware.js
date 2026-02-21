const { verifyToken } = require("@clerk/clerk-sdk-node");

module.exports = async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.replace("Bearer ", "");

    const payload = await verifyToken(token, {
      audience: "sportchain-backend",
    });

    req.auth = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
