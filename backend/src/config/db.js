const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // --- Clean up legacy/incorrect indexes that can cause duplicate key errors ---
    try {
      const db = mongoose.connection.db;
      const regColl = db.collection("registrations");

      // List existing indexes and drop the old `user_1_event_1` index if present
      const indexes = await regColl.indexes();
      const legacyIndex = indexes.find(
        (idx) => idx.key && idx.key.user === 1 && idx.key.event === 1
      );

      if (legacyIndex) {
        await regColl.dropIndex(legacyIndex.name);
        console.log(`Dropped legacy index: ${legacyIndex.name}`);
      }

      // Ensure Mongoose schema indexes are synced (will create `participant_1_event_1` unique index)
      const Registration = require("../models/Registration");
      await Registration.syncIndexes();
      console.log("Registration indexes synced with schema");
    } catch (indexErr) {
      // Non-fatal: log and continue
      console.warn("Index sync/cleanup skipped or failed:", indexErr.message);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
