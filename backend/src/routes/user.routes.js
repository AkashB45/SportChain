const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const attachUser = require("../middleware/attachUser.middleware");
const  {syncUser,saveWallet} =  require("../controllers/user.controller");
const { verifyCertificate } = require("../controllers/certificate.controller");
// Called immediately after login/signup
router.post("/sync", requireAuth, syncUser, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get("/me", attachUser, (req, res) => {
  res.json({
    id: req.user._id,
    clerkUserId: req.user.clerkUserId,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    adminRequest: req.user.adminRequest,
    walletAddress: req.user.walletAddress || null,
    organizerRequest: req.user.organizerRequest
  });
});

router.patch("/wallet", attachUser, saveWallet);

router.get("/verify/:hash", verifyCertificate);

module.exports = router;
