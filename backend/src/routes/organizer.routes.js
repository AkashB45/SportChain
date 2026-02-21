const express = require("express");
const router = express.Router();
const controller = require("../controllers/organizer.controller");
const Organizer = require("../models/Organizer");
const attachUser = require("../middleware/attachUser.middleware");
const {
  getMyEvents,
  getEventRegistrations,
  exportRegistrations,
  getEventRevenue ,
  getMyOrganizer,
  assignWinner,
  getWinners,
  clearEventWinners,
} = require("../controllers/organizer.controller");

const {generateCertificates} = require("../controllers/certificate.controller");
router.post("/verify", attachUser,controller.verifyOrganizer);
router.post("/verify-wallet", attachUser, controller.verifyWallet);


// Check organizer verification status (DB only)
router.get("/status/:wallet", async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();

    const organizer = await Organizer.findOne({
      walletAddress: wallet,
    });

    res.json({
      verified: organizer?.verified || false,
      name: organizer?.name || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/me", attachUser, getMyOrganizer);
router.get("/events", attachUser, getMyEvents);
router.get("/events/:eventId/registrations", attachUser, getEventRegistrations);
router.get("/events/:eventId/export", attachUser, exportRegistrations);
router.get("/events/:eventId/revenue", attachUser, getEventRevenue);
router.post("/events/:eventId/winner", attachUser, assignWinner);
router.get("/events/:eventId/winners", attachUser, getWinners);
router.delete("/events/:eventId/winners",attachUser,clearEventWinners);
router.post(
  "/events/:eventId/generate-certificates",
  attachUser,
  generateCertificates
);

module.exports = router;


