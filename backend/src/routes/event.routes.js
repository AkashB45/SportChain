const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const upload = require("../middleware/eventUpload.middleware");


const {
  createEvent,
  getAllEvents,
  getEventById,
  toggleRegistration,
  deleteEvent,
} = require("../controllers/event.controller");

// Public / Authenticated

// 🔥 THIS WAS MISSING
router.get("/:eventId", requireAuth, getEventById);

router.post(
  "/create",
  requireAuth,
  requireRole("organizer"),
  upload.single("banner"),
  createEvent
);
router.delete("/:id", requireAuth, requireRole("organizer"), deleteEvent);
router.patch(
  "/:eventId/toggle-registration",
  requireAuth,
  requireRole("organizer"),
  toggleRegistration
);
router.get("/", requireAuth, getAllEvents);


module.exports = router;
