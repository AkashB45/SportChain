const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    markedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

attendanceSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
