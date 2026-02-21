const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: String,
    name: String,
    role: {
      type: String,
      enum: ["participant", "organizer", "admin"],
      default: "participant",
    },
    organizerRequest: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    adminRequest: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    walletAddress: String,
    isOrganizerVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
