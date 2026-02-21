const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },

  organizationName: { type: String, required: true },
  description: String,

  walletAddress: {
    type: String,
    lowercase: true,
    sparse:true,
    unique: true,
  },

  photo: String,
  idProof: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  blockchainHash: String,

  verified: {
    type: Boolean,
    default: false   // ⭐ CRITICAL FIELD
  }

},{timestamps:true});


module.exports = mongoose.model("Organizer", organizerSchema);
