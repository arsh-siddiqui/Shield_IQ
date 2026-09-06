const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Scan = require("../models/Scan");
const sendSuccess = require("../utils/apiResponse");
const { toPublicUser } = require("./authController");

// @route  GET /api/users/profile
// @access Private
const getProfile = asyncHandler(async (req, res) => {
  return sendSuccess(res, { data: { user: toPublicUser(req.user) } });
});

// @route  PUT /api/users/profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "email", "accountRole"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, { message: "Profile updated.", data: { user: toPublicUser(user) } });
});

// @route  GET /api/users/dashboard
// @access Private
const getDashboardData = asyncHandler(async (req, res) => {
  const [recentScans, totalScans, safeScans, highRiskScans] = await Promise.all([
    Scan.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5),
    Scan.countDocuments({ user: req.user._id }),
    Scan.countDocuments({ user: req.user._id, riskLevel: { $regex: /safe|low/i } }),
    Scan.countDocuments({ user: req.user._id, riskLevel: { $regex: /high|critical/i } }),
  ]);

  const level = req.user.getLevel();

  return sendSuccess(res, {
    data: {
      user: toPublicUser(req.user),
      level,
      xpIntoLevel: req.user.xp % 300,
      recentScans,
      stats: {
        totalScans,
        safeScans,
        highRiskScans,
        simulationsCompleted: 0,
        quizzesCompleted: 0,
      },
    },
  });
});

// @route  GET /api/users/scans
// @access Private
const getScanHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  const [scans, total] = await Promise.all([
    Scan.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Scan.countDocuments({ user: req.user._id }),
  ]);

  return sendSuccess(res, {
    data: { scans },
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
});

// @route  GET /api/users/progress
// @access Private
const getProgress = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    data: {
      xp: req.user.xp,
      level: req.user.getLevel(),
      streakDays: req.user.streakDays,
      simulations: [],
      quizzes: [],
      bookmarkedArticles: [],
      likedArticles: [],
      readArticles: [],
      completedChallenges: [],
      lessonProgress: [],
    },
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getDashboardData,
  getScanHistory,
  getProgress,
};
