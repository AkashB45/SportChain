const mongoose = require("mongoose");

const prizeSchema = new mongoose.Schema({
  first: { type: String, required: true },
  second: { type: String },
  third: { type: String },
});



const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    sport: { type: String, required: true },
    category: {
      type: String,
      enum: ["junior", "senior", "open"],
      required: true,
    },

    date: { type: Date, required: true },
    venue: { type: String, required: true },
    locationUrl: { type: String, required: true },

    banner: { type: String, required: true },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventType: {
      type: String,
      enum: ["individual", "team"],
      default: "individual",
    },
    teamSize: { type: Number, default: 1 },

    capacity: { type: Number, min: 1, required: true },
    participantCount: { type: Number, default: 0 },

    fee: { type: Number, min: 0, default: 0 },

    prizeDetails: { type: prizeSchema, required: true },

    contactName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    
    certificateEnabled: { type: Boolean, default: false },

    registrationsClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
