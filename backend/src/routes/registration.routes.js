const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const attachUser = require("../middleware/attachUser.middleware");
const {
  
  getRegistrationsForEvent,
  registerFreeEvent,
  checkRegistrationStatus,
  getMyRegistrations,
  unregisterEvent,
  
} = require("../controllers/registration.controller");




router.get("/my", attachUser, getMyRegistrations);

// Organizer views participants
router.get(
  "/:eventId",
  requireAuth,
  requireRole("organizer"),
  getRegistrationsForEvent
);


router.post(
  "/free",
  requireAuth,
  attachUser,
  registerFreeEvent
);

router.get(
  "/status/:eventId",
  requireAuth,
  attachUser,
  checkRegistrationStatus
);

router.delete(
  "/unregister/:eventId",
  attachUser,
  requireRole("participant"),
  unregisterEvent
);



module.exports = router;
