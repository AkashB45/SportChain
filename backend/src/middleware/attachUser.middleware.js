const User = require("../models/User");
const { clerkClient } = require("@clerk/express");

module.exports = async function attachUser(req, res, next) {
  try {
    const auth = req.auth();

    if (!auth?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔹 Fetch full user from Clerk
    const clerkUser = await clerkClient.users.getUser(auth.userId);

    let user = await User.findOne({ clerkUserId: auth.userId });

    if (!user) {
      user = await User.create({
        clerkUserId: auth.userId,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        name:
          [clerkUser.firstName, clerkUser.lastName]
            .filter(Boolean)
            .join(" ") || "New User",
        role: "participant",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("ATTACH USER ERROR:", err);
    res.status(500).json({ message: "User attach failed" });
  }
};
