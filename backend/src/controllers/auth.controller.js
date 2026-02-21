const User = require("../models/User");
const { clerkClient } = require("@clerk/clerk-sdk-node");

exports.syncUser = async (req, res) => {
  try {
    const { userId } = req.auth(); // auth info only

    // 🔑 Fetch full user profile from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);

    let user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      user = await User.create({
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        role: "participant",
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Sync user error:", err);
    res.status(500).json({ message: "Failed to sync user" });
  }
};
