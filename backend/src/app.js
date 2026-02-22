const express = require("express");
const { clerkMiddleware } = require("@clerk/express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const registrationRoutes = require("./routes/registration.routes");
const adminRoutes = require("./routes/admin.routes");
const organizerRoutes = require("./routes/organizer.routes");
const paymentRoutes = require("./routes/payment.routes");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const attendanceRoutes = require("./routes/attendance.routes");
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/organizer",organizerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/attendance", attendanceRoutes);



app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (res.headersSent) {
    return next(err);  // 🔥 Prevent double-send crash
  }

  res.status(500).json({ message: err.message || "Server error" });
});


app.get("/", (req, res) => {
  res.send("SportChain API Running");
});


module.exports = app;
