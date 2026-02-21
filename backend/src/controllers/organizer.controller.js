const { ethers } = require("ethers");
const contract = require("../blockchain/contract");
const Organizer = require("../models/Organizer");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const crypto = require("crypto");
const User = require("../models/User");
const { Parser } = require("json2csv");
const Attendance = require("../models/Attendance");
const EventWinner = require("../models/EventWinner");
exports.verifyWallet = async (req, res) => {
  const { walletAddress } = req.body;

  const organizer = await Organizer.findOne({ user: req.user._id });
  if (!organizer)
    return res.status(404).json({ message: "Organizer request not found" });

  const hash = crypto
    .createHash("sha256")
    .update(organizer.organizationName + organizer.user + Date.now())
    .digest("hex");

  const tx = await contract.verifyOrganizer(
    walletAddress,
    "0x" + hash
  );

  await tx.wait();

  organizer.blockchainHash = hash;
  organizer.status = "approved";
  organizer.verified = true;
  await organizer.save();

  res.json({ success: true, txHash: tx.hash });
};

exports.verifyOrganizer = async (req, res) => {
  try {
    const { organizerWallet } = req.body;

    if (!organizerWallet)
      return res.status(400).json({ message: "Wallet address required" });

    const checksumWallet = ethers.getAddress(organizerWallet);

    // 1️⃣ Organizer must exist
    const organizer = await Organizer.findOne({
      user: req.user._id,
      walletAddress: checksumWallet.toLowerCase(),
      status: "approved",
    });

    if (!organizer)
      return res.status(403).json({
        message: "Admin approval required before blockchain verification",
      });

    if (organizer.verified)
      return res.json({ message: "Already blockchain verified" });

    // 2️⃣ Blockchain write
    const tx = await contract.verifyOrganizer(checksumWallet);
    await tx.wait();

    // 3️⃣ Create immutable blockchain hash
    const hash = crypto
      .createHash("sha256")
      .update(`${organizer._id}-${checksumWallet}-${tx.hash}`)
      .digest("hex");

    organizer.blockchainHash = hash;
    organizer.verified = true;
    await organizer.save();

    res.json({
      success: true,
      txHash: tx.hash,
      blockchainHash: hash,
      message: "Organizer blockchain verified successfully",
    });
  } catch (err) {
    console.error("VERIFY ORGANIZER ERROR:", err);
    res.status(500).json({ message: "Blockchain verification failed" });
  }
};


exports.getMyEvents = async (req, res, next) => {
  try {

    if (req.user.role !== "organizer") {
  return res.status(403).json({ message: "Only organizers can create events" });
}

    const events = await Event.find({ organizer: req.user._id }).sort({
      createdAt: -1,
    });

    const enriched = await Promise.all(
      events.map(async (event) => {
        const count = await Registration.countDocuments({
          event: event._id,
        });

        return {
          ...event.toObject(),
          participantCount: count,
          capacityReached: count >= event.capacity,
        };
      })
    );

    return res.json(enriched);   // 🔥 ONLY ONE RESPONSE
  } catch (err) {
    return next(err);
  }
};



/* ================= PARTICIPANT LIST ================= */

exports.getEventRegistrations = async (req, res) => {
  try {
    if (req.user.role !== "organizer") return res.sendStatus(403);

    const regs = await Registration.find({ event: req.params.eventId })
      .sort({ createdAt: -1 });

    res.json(
      regs.map((r) => ({
        _id: r._id,
        registeredBy: r.registeredBy,
        members: r.members,                    // 👈 team or individual
        createdAt: r.createdAt,
        paymentStatus: r.paymentStatus,
        paymentId: r.paymentId || null,
      }))
    );
  } catch (err) {
    console.error("FETCH REG ERROR:", err);
    res.status(500).json({ message: "Failed to fetch participants" });
  }
};

/* ================= CSV EXPORT ================= */

exports.exportRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ event: req.params.eventId });

    let rows = [];
    let sno = 1;

    regs.forEach((r) => {
      r.members.forEach((m, idx) => {
        rows.push({
          SNo: sno++,
          TeamID: r._id,
          MemberNo: idx + 1,
          Name: m.name,
          Email: m.email,
          Contact: m.contact,
          RegisteredDate: r.createdAt.toISOString().split("T")[0],
          PaymentStatus: r.paymentStatus,
          PaymentId: r.paymentStatus === "PAID" ? r.paymentId : "",
        });
      });
    });

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("participants.csv");
    res.send(csv);
  } catch (err) {
    console.error("CSV ERROR:", err);
    res.status(500).json({ message: "CSV export failed" });
  }
};


exports.getEventRevenue = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const registrations = await Registration.find({ event: eventId });

    const totalRegistrations = registrations.length;
    const paidCount = registrations.filter(r => r.paymentStatus === "PAID").length;
    const freeCount = registrations.filter(r => r.paymentStatus === "FREE").length;

    const revenue = paidCount * event.fee;

    return res.json({
      eventId,
      totalRegistrations,
      paidCount,
      freeCount,
      revenue
    });
  } catch (err) {
    console.error("REVENUE ERROR:", err);
    res.status(500).json({ message: "Failed to compute revenue" });
  }
};

exports.getMyOrganizer = async (req, res) => {
  const org = await Organizer.findOne({ user: req.user._id });
  res.json(org);
};




exports.assignWinner = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { registrationId, position } = req.body;

    if (!["FIRST", "SECOND", "THIRD"].includes(position)) {
      return res.status(400).json({ message: "Invalid prize position" });
    }

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Ensure prize exists in event.prizeDetails
    const prizeKey = position.toLowerCase();
    if (!event.prizeDetails?.[prizeKey]) {
      return res.status(400).json({ message: `${position} prize not configured` });
    }

    // Check registration exists
    const registration = await Registration.findById(registrationId);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    // Must belong to same event
    if (registration.event.toString() !== eventId)
      return res.status(400).json({ message: "Registration not in this event" });

    // Ensure attendance present
    const attended = registration.members?.some(m => m.attended);
    if (!attended)
      return res.status(400).json({ message: "Participant did not attend" });

    // Ensure only ONE winner per position
    await EventWinner.findOneAndDelete({ event: eventId, position });

    // Remove previous prize for this registration (if upgrading)
    await EventWinner.findOneAndDelete({ event: eventId, registration: registrationId });

    // Create new winner
    const winner = await EventWinner.create({
      event: eventId,
      registration: registrationId,
      position,
    });

    res.json(winner);

  } catch (err) {
    console.error("ASSIGN WINNER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWinners = async (req, res) => {
  const { eventId } = req.params;

  const winners = await EventWinner.find({ event: eventId })
    .populate({
      path: "registration",
      populate: { path: "members" },
    });

  res.json(winners);
};

exports.clearEventWinners = async (req, res) => {
  try {
    await EventWinner.deleteMany({ event: req.params.eventId });
    res.json({ message: "All winners removed" });
  } catch (err) {
    console.error("CLEAR WINNERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

