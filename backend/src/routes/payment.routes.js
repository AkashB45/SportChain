const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");
const attachUser = require("../middleware/attachUser.middleware");
const {
  createOrder,
  verifyPayment,
} = require("../controllers/payment.controller");

router.post("/create-order", requireAuth, createOrder);
router.post("/verify", requireAuth, attachUser, verifyPayment);

module.exports = router;
