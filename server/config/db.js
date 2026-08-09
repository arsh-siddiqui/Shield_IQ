const mongoose = require("mongoose");
const env = require("./env");

let hasConnected = false;

/**
 * Connects to MongoDB Atlas (or any Mongo instance) via Mongoose.
 *
 * Deliberately does NOT call process.exit() on failure — in this project
 * the API should still boot and answer health checks / serve routes that
 * don't touch the database even if MongoDB isn't reachable yet, so a
 * missing MONGO_URI during initial setup doesn't take the whole server down.
 * Routes that need the DB will simply fail with a clear 503 until it connects
 * (see middleware/requireDb.js).
 */
async function connectDB() {
  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    hasConnected = true;
    // eslint-disable-next-line no-console
    console.log(`[shieldiq] MongoDB connected → ${mongoose.connection.name}`);
  });

  mongoose.connection.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error(`[shieldiq] MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    hasConnected = false;
    // eslint-disable-next-line no-console
    console.warn("[shieldiq] MongoDB disconnected");
  });

  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      `[shieldiq] Initial MongoDB connection failed: ${err.message}\n` +
        "[shieldiq] The API server will keep running, but any route touching the database will return 503 until MONGO_URI is reachable."
    );
  }
}

function isDbConnected() {
  return hasConnected && mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isDbConnected };
