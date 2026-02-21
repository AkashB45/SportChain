const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");
const { syncUser } = require("../controllers/auth.controller");

router.post("/sync", requireAuth, syncUser);

module.exports = router;
