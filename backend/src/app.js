const express = require("express");
const { clerkMiddleware } = require("@clerk/express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const registrationRoutes = require("./routes/registration.routes");
const adminRoutes = require("./routes/admin.routes");
const organizerRoutes = require("./routes/organizer.routes");
const paymentRoutes = require("./routes/payment.routes");
const userRoutes = require("./routes/user.routes");
const attendanceRoutes = require("./routes/attendance.routes");

// ✅ Safer CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  })
);

// ✅ Body parser with size limit
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ Clerk auth
app.use(clerkMiddleware());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/attendance", attendanceRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("SportChain API Running");
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: err.message || "Server error",
  });
});

module.exports = app;