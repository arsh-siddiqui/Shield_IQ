/**
 * Database cleanup script for ShieldIQ.
 *
 * Removes obsolete demo accounts (e.g. aarav.mehta@example.com) and associated
 * legacy test data, while strictly preserving real registered users, real user
 * progress, and the admin account (admin@shieldiq.app).
 *
 * Run with: npm run cleanup (inside server directory)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const env = require("../config/env");

const User = require("../models/User");
const LessonProgress = require("../models/LessonProgress");
const QuizResult = require("../models/QuizResult");
const SimulationResult = require("../models/SimulationResult");
const ScanHistory = require("../models/ScanHistory");

async function cleanup() {
  await mongoose.connect(env.MONGO_URI);
  console.log(`[cleanup] Connected to database ${mongoose.connection.name}`);

  // Find demo user
  const demoUser = await User.findOne({ email: "aarav.mehta@example.com" });

  if (demoUser) {
    console.log(`[cleanup] Found demo user: ${demoUser.email} (ID: ${demoUser._id})`);

    // Clean up demo user's records
    const resProgress = await LessonProgress.deleteMany({ userId: demoUser._id });
    const resQuiz = await QuizResult.deleteMany({ userId: demoUser._id });
    const resSim = await SimulationResult.deleteMany({ userId: demoUser._id });
    const resScan = await ScanHistory.deleteMany({ userId: demoUser._id });

    console.log(`[cleanup] Removed ${resProgress.deletedCount} lesson progress records for demo user`);
    console.log(`[cleanup] Removed ${resQuiz.deletedCount} quiz results for demo user`);
    console.log(`[cleanup] Removed ${resSim.deletedCount} simulation results for demo user`);
    console.log(`[cleanup] Removed ${resScan.deletedCount} scan history records for demo user`);

    await User.deleteOne({ _id: demoUser._id });
    console.log("[cleanup] Deleted demo user account.");
  } else {
    console.log("[cleanup] No demo user (aarav.mehta@example.com) found in database.");
  }

  // Count remaining legitimate users
  const totalUsers = await User.countDocuments();
  const adminCount = await User.countDocuments({ role: "admin" });

  console.log(`[cleanup] Database summary: ${totalUsers} total users remaining (${adminCount} admin).`);
  console.log("[cleanup] Cleanup complete.");

  await mongoose.disconnect();
  process.exit(0);
}

cleanup().catch((err) => {
  console.error("[cleanup] Failed:", err);
  process.exit(1);
});
