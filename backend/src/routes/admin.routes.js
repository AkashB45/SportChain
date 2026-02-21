const express = require("express");
const router = express.Router();
const attachUser = require("../middleware/attachUser.middleware");
const requireRole = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");
const controller = require("../controllers/admin.controller");
const isAdmin = require("../middleware/isAdmin.middleware");
const User = require("../models/User");


router.post(
  "/request-organizer",
  attachUser,
  requireRole("participant"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
  ]),
  controller.requestOrganizer
);

router.get(
  "/organizers",
  attachUser,
  requireRole("admin"),
  controller.getPendingOrganizers
);

router.patch(
  "/organizers/:id/approve",
  attachUser,
  requireRole("admin"),
  controller.approveOrganizer
);

router.patch(
  "/organizers/:id/reject",
  attachUser,
  requireRole("admin"),
  controller.rejectOrganizer
);

router.get(
  "/my-organizer-request",
  attachUser,
  controller.getMyOrganizerRequest
);
router.delete(
  "/cancel-organizer-request",
  attachUser,
  controller.cancelOrganizerRequest
);

router.post("/request-admin", attachUser, async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "admin") {
      return res.status(400).json({ message: "You are already an admin" });
    }

    if (user.adminRequest === "pending") {
      return res.status(400).json({ message: "Request already pending" });
    }

    user.adminRequest = "pending";
    await user.save();

    res.json({ message: "Admin request submitted" });
  } catch (err) {
    res.status(500).json({ message: "Request failed" });
  }
});


function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

router.get("/requests", attachUser, requireAdmin, async (req, res) => {
  const users = await User.find({ adminRequest: "pending" });
  res.json(users);
});

router.get("/all-admins", attachUser, requireAdmin, async (req, res) => {
  const admins = await User.find({ role: "admin" });
  res.json(admins);
});

router.post("/approve/:id", attachUser, requireAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    role: "admin",
    adminRequest: "approved",
  });
  res.json({ success: true });
});

router.post("/reject/:id", attachUser, requireAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    adminRequest: "rejected",
  });
  res.json({ success: true });
});

// 🚨 Remove admin safely
router.patch("/remove-admin/:id", attachUser, requireAdmin, async (req, res) => {
  const adminCount = await User.countDocuments({ role: "admin" });

  if (adminCount <= 1) {
    return res.status(400).json({ message: "Cannot remove the last admin" });
  }

  const target = await User.findById(req.params.id);
  if (!target || target.role !== "admin") {
    return res.status(404).json({ message: "Admin not found" });
  }

  target.role = "participant";
  target.adminRequest = "none";
  await target.save();

  res.json({ success: true });
});

module.exports = router;
