require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const env = require("../config/env");

const User = require("../models/User");
const Vulnerability = require("../models/Vulnerability");


async function seed() {
  await mongoose.connect(env.MONGO_URI);
  console.log(`[seed] Connected to ${mongoose.connection.name}`);

  // --- Admin user ---
  let admin = await User.findOne({ email: env.ADMIN_SEED_EMAIL });
  if (!admin) {
    admin = await User.create({
      name: "DetectIQ Admin",
      email: env.ADMIN_SEED_EMAIL,
      password: env.ADMIN_SEED_PASSWORD,
      role: "admin",
      accountRole: "Business",
    });
    console.log(`[seed] Created admin user: ${admin.email}`);
  } else {
    console.log(`[seed] Admin user already exists: ${admin.email}`);
  }

  // --- Cleanup legacy demo user ---
  const deletedDemo = await User.deleteOne({ email: "aarav.mehta@example.com" });
  if (deletedDemo.deletedCount > 0) {
    console.log("[seed] Cleaned up legacy demo user: aarav.mehta@example.com");
  }

  console.log("[seed] Done.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
