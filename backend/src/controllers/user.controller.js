const User = require("../models/User");
const { clerkClient } = require("@clerk/clerk-sdk-node");
const Organizer = require("../models/Organizer");

exports.syncUser = async (req, res) => {
  try {
    const { userId, emailAddresses, firstName, lastName } = req.auth();

    let user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      user = await User.create({
        clerkUserId: userId,
        email: emailAddresses?.[0]?.emailAddress || "",
        name: `${firstName || ""} ${lastName || ""}`.trim(),
        role: "participant",
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("USER SYNC ERROR:", err);
    res.status(500).json({ error: "User sync failed" });
  }
};


exports.saveWallet = async (req, res) => {
  const { walletAddress } = req.body;

  await User.findByIdAndUpdate(req.user._id, { walletAddress });

  // 🔥 attach wallet to organizer record
  await Organizer.findOneAndUpdate(
    { user: req.user._id },
    { walletAddress: walletAddress.toLowerCase() }
  );

  res.json({ success: true });
};
