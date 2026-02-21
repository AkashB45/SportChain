const router = require("express").Router();
const requireAuth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const { getMyQR, scanQR } = require("../controllers/attendance.controller");

router.get("/qr/:eventId", requireAuth, requireRole("participant"), getMyQR);
router.post("/scan", requireAuth, requireRole("organizer"), scanQR);

module.exports = router;
