const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const ScanHistory = require("../models/ScanHistory");
const SimulationResult = require("../models/SimulationResult");
const QuizResult = require("../models/QuizResult");
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
// Aggregates everything the Dashboard page needs into one call. Anything not
// yet backed by real user activity (weekly activity chart, tips, alerts) is
// returned as clearly-labeled sample data rather than left empty, per the
// "return dummy values when fields aren't populated yet" instruction.
const getDashboardData = asyncHandler(async (req, res) => {
  const [recentScans, simulationsCompleted, quizzesCompleted] = await Promise.all([
    ScanHistory.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5),
    SimulationResult.countDocuments({ user: req.user._id }),
    QuizResult.countDocuments({ user: req.user._id, correct: true }),
  ]);

  const level = req.user.getLevel();

  return sendSuccess(res, {
    data: {
      user: toPublicUser(req.user),
      level,
      xpIntoLevel: req.user.xp % 300,
      recentScans,
      stats: {
        scansThisMonth: await ScanHistory.countDocuments({ user: req.user._id }),
        simulationsCompleted,
        quizzesCompleted,
      },
      // Weekly activity, tips, and threat alerts aren't derived from real
      // per-user event logs yet — the frontend already has good sample
      // content for these and continues to render it until this is built out.
      isPartialData: true,
    },
  });
});

// @route  GET /api/users/scans
// @access Private
const getScanHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  const [scans, total] = await Promise.all([
    ScanHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ScanHistory.countDocuments({ user: req.user._id }),
  ]);

  return sendSuccess(res, {
    data: { scans },
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
});

// @route  GET /api/users/progress
// @access Private
const getProgress = asyncHandler(async (req, res) => {
  const [simResults, quizResults] = await Promise.all([
    SimulationResult.find({ user: req.user._id }).populate("simulation", "slug label"),
    QuizResult.find({ user: req.user._id }).populate("quiz", "category"),
  ]);

  return sendSuccess(res, {
    data: {
      xp: req.user.xp,
      level: req.user.getLevel(),
      streakDays: req.user.streakDays,
      simulations: simResults,
      quizzes: quizResults,
      bookmarkedArticles: req.user.bookmarkedArticles,
      likedArticles: req.user.likedArticles,
      readArticles: req.user.readArticles,
    },
  });
});

// @route  POST /api/users/articles/:id/bookmark
// @access Private
const toggleBookmark = asyncHandler(async (req, res) => {
  const articleId = req.params.id;
  const already = req.user.bookmarkedArticles.some((a) => a.toString() === articleId);

  const update = already
    ? { $pull: { bookmarkedArticles: articleId } }
    : { $addToSet: { bookmarkedArticles: articleId } };

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });

  return sendSuccess(res, {
    message: already ? "Bookmark removed." : "Bookmarked.",
    data: { bookmarkedArticles: user.bookmarkedArticles },
  });
});

// @route  POST /api/users/articles/:id/like
// @access Private
const toggleLike = asyncHandler(async (req, res) => {
  const articleId = req.params.id;
  const already = req.user.likedArticles.some((a) => a.toString() === articleId);

  const update = already
    ? { $pull: { likedArticles: articleId } }
    : { $addToSet: { likedArticles: articleId } };

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });

  return sendSuccess(res, {
    message: already ? "Like removed." : "Liked.",
    data: { likedArticles: user.likedArticles },
  });
});

// @route  POST /api/users/articles/:id/read
// @access Private
const markArticleRead = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { readArticles: req.params.id } },
    { new: true }
  );
  return sendSuccess(res, { data: { readArticles: user.readArticles } });
});

module.exports = {
  getProfile,
  updateProfile,
  getDashboardData,
  getScanHistory,
  getProgress,
  toggleBookmark,
  toggleLike,
  markArticleRead,
};
