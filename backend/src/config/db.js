const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set. Set it in Vercel Environment Variables.");
    throw new Error("Missing MONGO_URI");
  }
  // If mongoose is already connected or in the process of connecting, avoid calling connect() again.
  const state = mongoose.connection.readyState; // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (state === 1) {
    console.log("MongoDB: already connected (readyState=1)");
    return;
  }
  if (state === 2) {
    console.log("MongoDB: connection already in progress (readyState=2)");
    return;
  }

  try {
    // Use sensible timeouts so serverless cold-starts fail fast instead of hanging
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS
        ? Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS)
        : 10000,
      connectTimeoutMS: process.env.MONGO_CONNECT_TIMEOUT_MS
        ? Number(process.env.MONGO_CONNECT_TIMEOUT_MS)
        : 10000,
    });
    console.log("MongoDB Connected");

    // Avoid running potentially long index operations in production serverless environments.
    const shouldSyncIndexes =
      process.env.NODE_ENV !== "production" || process.env.RUN_INDEX_SYNC === "true";

    if (shouldSyncIndexes) {
      try {
        const db = mongoose.connection.db;
        const regColl = db.collection("registrations");

        // Drop legacy index `user_1_event_1` if present
        const indexes = await regColl.indexes();
        const legacyIndex = indexes.find(
          (idx) => idx.key && idx.key.user === 1 && idx.key.event === 1
        );

        if (legacyIndex) {
          await regColl.dropIndex(legacyIndex.name);
          console.log(`Dropped legacy index: ${legacyIndex.name}`);
        }

        // Ensure Mongoose schema indexes are synced (only in dev or when explicitly requested)
        const Registration = require("../models/Registration");
        await Registration.syncIndexes();
        console.log("Registration indexes synced with schema");
      } catch (indexErr) {
        // Non-fatal: log and continue
        console.warn("Index sync/cleanup skipped or failed:", indexErr.message);
      }
    } else {
      console.log("Skipping index sync in production (set RUN_INDEX_SYNC=true to override)");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    // Throw so calling code (or Vercel) receives the failure and logs full stack
    throw err;
  }
};

module.exports = connectDB;
