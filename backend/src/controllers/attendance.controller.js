const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");
const Event = require("../models/Event");

exports.getMyQR = async (req, res) => {
  const userId = req.user._id;
  const { eventId } = req.params;

  const registration = await Registration.findOne({
    registeredBy: userId,
    event: eventId,
  });

  if (!registration) return res.status(403).json({ message: "Not registered" });

  const token = jwt.sign(
    { userId, eventId },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }, // QR valid only 5 minutes
  );
  // console.log("Token received:", token);
  // console.log("Using secret:", process.env.JWT_SECRET);

  const qrImage = await QRCode.toDataURL(token);
  res.json({ qr: qrImage });
};

exports.scanQR = async (req, res) => {
  try {
    const { token, eventId } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.eventId !== eventId)
      return res.status(400).json({ message: "Invalid event QR" });

    const registration = await Registration.findOne({
      registeredBy: decoded.userId,
      event: eventId,
    });

    if (!registration)
      return res.status(403).json({ message: "User not registered" });

    // Check if already marked
    if (registration.attended) {
      return res.json({ message: "Attendance already marked" });
    }

    await Attendance.findOneAndUpdate(
  { user: decoded.userId, event: eventId },
  { $setOnInsert: { markedAt: new Date() } },
  { upsert: true, new: true }
);


    // 🔥 UPDATE REGISTRATION MAIN ATTENDANCE
    registration.attended = true;

    // 🔥 UPDATE ALL TEAM MEMBERS AS ATTENDED (if team event)
    if (registration.members && registration.members.length > 0) {
      registration.members.forEach(member => {
        member.attended = true;
      });
    }

    await registration.save();

    res.json({ message: "Attendance marked successfully" });

  } catch (err) {
    console.error("QR VERIFY ERROR:", err.message);
    return res.status(400).json({ message: "Invalid or expired QR" });
  }
};

