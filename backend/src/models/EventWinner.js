const mongoose = require("mongoose");

const eventWinnerSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },
    position: {
      type: String,
      enum: ["FIRST", "SECOND", "THIRD"],
      required: true,
    },
  },
  { timestamps: true }
);

// 🚫 Only ONE winner per position per event
eventWinnerSchema.index({ event: 1, position: 1 }, { unique: true });

// 🚫 One registration cannot win multiple prizes
eventWinnerSchema.index({ registration: 1 }, { unique: true });

module.exports = mongoose.model("EventWinner", eventWinnerSchema);
