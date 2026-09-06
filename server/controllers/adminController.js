const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Scan = require("../models/Scan");
const AdminLog = require("../models/AdminLog");
const sendSuccess = require("../utils/apiResponse");
const { toPublicUser } = require("./authController");

// @route  GET /api/admin/stats
// @access Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, scansToday] = await Promise.all([
    User.countDocuments(),
    Scan.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
  ]);

  return sendSuccess(res, {
    data: {
      totalUsers,
      totalArticles: 0,
      publishedArticles: 0,
      totalSimulations: 0,
      scansToday,
    },
  });
});

// @route  GET /api/admin/analytics
// @access Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [userGrowth, scanGrowth, riskDistribution] = await Promise.all([
    User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Scan.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Scan.aggregate([{ $group: { _id: "$riskLevel", count: { $sum: 1 } } }]),
  ]);

  return sendSuccess(res, { data: { userGrowth, scanGrowth, riskDistribution } });
});

// @route  GET /api/admin/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const search = req.query.search || "";

  const filter = search ? { name: { $regex: search, $options: "i" } } : {};

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return sendSuccess(res, {
    data: { users: users.map(toPublicUser) },
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
});

// @route  PUT /api/admin/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "accountRole", "status", "role"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  await AdminLog.create({ admin: req.user._id, action: "user.update", targetId: user._id, details: updates });

  return sendSuccess(res, { message: "User updated.", data: { user: toPublicUser(user) } });
});

// @route  DELETE /api/admin/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error("You can't delete your own admin account.");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  await AdminLog.create({ admin: req.user._id, action: "user.delete", targetId: req.params.id });

  return sendSuccess(res, { message: "User deleted." });
});

module.exports = { 
  getStats, getAnalytics, getUsers, updateUser, deleteUser
};
