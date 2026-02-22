require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// connectDB();

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = async (req, res) => {
  await connectDB();   // 🔥 ENSURE DB CONNECTED FIRST
  return app(req, res);
};

