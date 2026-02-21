const Registration = require("../models/Registration");
const Event = require("../models/Event");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Attendance = require("../models/Attendance");

exports.getRegistrationsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).lean();

    const winnerMap = {};
    event.winners.forEach(w => {
      winnerMap[w.registration.toString()] = w.position;
    });

    const registrations = await Registration.find({ event: eventId }).lean();

    const enriched = registrations.map(reg => {
      const teamAttended = reg.members.some(m => m.attended === true);

      return {
        ...reg,
        attended: teamAttended, // ✅ team participated if at least one member attended
        winnerPosition: reg.winnerPosition || winnerMap[reg._id.toString()] || null,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error("Fetch participants error:", err);
    res.status(500).json({ message: "Failed to load participants" });
  }
};


exports.registerFreeEvent = async (req, res) => {
  try {
    const { eventId, members } = req.body;
    const userId = req.user._id;
    const qrToken = crypto.randomBytes(16).toString("hex");
    const event = await Event.findById(eventId);

    if (event.organizer.toString() === userId.toString()) {
      return res.status(403).json({
        message: "Organizers cannot register for their own event",
      });
    }

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    if (members.length !== (event.type === "team" ? event.teamSize : 1)) {
      return res.status(400).json({ message: "Invalid team size" });
    }

    const existing = await Registration.findOne({
      registeredBy: userId,
      event: eventId,
    });
    if (existing)
      return res.status(409).json({ message: "Already registered" });

    const totalRegistrations = await Registration.countDocuments({
      event: eventId,
    });

    if (totalRegistrations >= event.capacity) {
      return res.status(403).json({
        message: "Event capacity reached",
      });
    }

    if (event.registrationsClosed) {
      return res.status(403).json({
        message: "Registrations are closed",
      });
    }

    await Registration.create({
      registeredBy: userId,
      event: eventId,
      members,
      qrToken,
      paymentStatus: "FREE",
    });

    event.participantCount += 1;
    await event.save();

    res.status(201).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Registration failed" });
  }
};


exports.checkRegistrationStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔒 organizer check
    const isOwner =
      event.organizer && event.organizer.toString() === userId.toString();

    // ✅ registration check
    const registration = await Registration.findOne({
      registeredBy: userId,
      event: eventId,
    });

    return res.json({
      registered: !!registration,
      owner: isOwner,
    });
  } catch (err) {
    console.error("CHECK STATUS ERROR:", err);
    return res
      .status(500)
      .json({ message: "Failed to check registration status" });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ registeredBy: req.user._id })
      .populate({
        path: "event",
        select:
          "title venue date banner fee category locationUrl capacity participantCount",
      })
      .sort({ createdAt: -1 });

    const now = new Date();

    const upcoming = regs.filter((r) => new Date(r.event.date) >= now);
    const past = regs.filter((r) => new Date(r.event.date) < now);

    res.json({ upcoming, past });
  } catch (err) {
    console.error("GET MY REG ERROR:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

exports.unregisterEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const reg = await Registration.findOneAndDelete({
      event: eventId,
      registeredBy: req.user._id,
    });

    if (!reg) return res.status(404).json({ message: "Not registered" });

    await Event.findByIdAndUpdate(eventId, {
      $inc: { participantCount: -1 },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("UNREGISTER ERROR:", err);
    res.status(500).json({ message: "Failed to cancel registration" });
  }
};
