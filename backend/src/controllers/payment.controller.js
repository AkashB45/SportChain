const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
// const razorpay = require("../config/razorpay");

exports.createOrder = async (req, res) => {
  try {
    const { amount, eventId } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: `event_${eventId}`,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      eventId,
      members,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !eventId)
      return res.status(400).json({ message: "Missing payment details" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature)
      return res.status(400).json({ message: "Invalid signature" });

    const teamSize = event.eventType === "team" ? event.teamSize : 1;
    if (!Array.isArray(members) || members.length !== teamSize)
      return res.status(400).json({ message: "Invalid members count" });
    
    const qrToken = crypto.randomBytes(16).toString("hex");

    await Registration.create({
      registeredBy: userId,
      event: eventId,
      members,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: "PAID",
      qrToken,
    });

    event.participantCount += 1;
    await event.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
};
