const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  attended: { type: Boolean, default: false }, // 🔥 Track member attendance
  checkInTime: Date,
  certificate: {
    tokenId: String,
    txHash: String,
    metadataURI: String,
  },
});

const RegistrationSchema = new mongoose.Schema(
  {
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // 🔹 Payment details (ONLY for paid events)
    orderId: {
      type: String,
      default: null,
    },

    members: [memberSchema], // 🔥 Individual = 1, Team = teamSize
    paymentId: {
      type: String,
      default: null,
    },
    // 🎟 ONE QR for whole registration
    qrToken: { type: String, unique: true, required: true },

    // For single-person quick check
    attended: { type: Boolean, default: false },
    winnerPosition: {
      type: Number,
      enum: [1, 2, 3],
      default: null,
    },
    checkInTime: Date,
    paymentStatus: {
      type: String,
      enum: ["FREE", "PAID"],
      required: true,
    },
    certificateIssued: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// ✅ Prevent duplicate registration (free or paid)
RegistrationSchema.index({ registeredBy: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Registration", RegistrationSchema);
